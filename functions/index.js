/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const cors = require('cors')({origin: true});
const vision = require('@google-cloud/vision');
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Vision API client
const visionClient = new vision.ImageAnnotatorClient();

exports.verifyAge = onRequest({
  cors: true,
  maxInstances: 10
}, async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify Firebase Auth token
    const authToken = req.headers.authorization?.split('Bearer ')[1];
    if (!authToken) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(authToken);
    const userId = decodedToken.uid;

    // Process multipart form data
    const busboy = Busboy({ 
      headers: req.headers,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1
      }
    });

    const fields = {};
    let hasFile = false;

    // Handle fields
    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    // Handle file upload
    busboy.on('file', (fieldname, file, { filename, encoding, mimeType }) => {
      if (fieldname === 'document' && filename) {
        hasFile = true;
      }
      // Consume the file stream but don't store it
      file.resume();
    });

    // Wait for busboy to finish
    await new Promise((resolve, reject) => {
      busboy.on('finish', resolve);
      busboy.on('error', reject);
      req.pipe(busboy);
    });

    if (!hasFile || !fields.dob) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: !fields.dob ? 'Date of birth is required' : 'ID document is required'
      });
    }

    // Calculate age
    const birthDate = new Date(fields.dob);
    if (isNaN(birthDate.getTime())) {
      return res.status(400).json({ 
        error: 'Invalid date format',
        details: 'Please provide a valid date of birth'
      });
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      return res.status(400).json({ 
        error: 'Age requirement not met',
        details: 'You must be 18 or older'
      });
    }

    // Update user data in Firestore
    await admin.firestore().collection('users').doc(userId).update({
      ageVerified: true,
      dateOfBirth: fields.dob,
      age: age,
      verificationDate: admin.firestore.FieldValue.serverTimestamp(),
      onboardingStep: 'user-type'
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Age verification successful',
      age: age
    });

  } catch (error) {
    console.error('Error in verifyAge:', error);
    return res.status(500).json({ 
      error: 'Verification failed',
      details: error.message
    });
  }
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
