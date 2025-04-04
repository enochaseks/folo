import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/global.css';

const ConfirmSubscription = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your subscription...');

  useEffect(() => {
    const confirmSubscription = async () => {
      try {
        // In ConfirmSubscription.js - Remove "localhost" or hardcoded IPs
const response = await axios.post(
    '/api/newsletter/confirm',  // Relative path (auto uses current domain)
    { token }
  );
        
        if (response.data.success) {
          setStatus('success');
          setMessage('Your email has been confirmed! Thanks for subscribing.');
          
          // Redirect to home after 3 seconds
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Verification failed.');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 
                  'Could not verify subscription. Please try again later.');
      }
    };

    if (token) {
      confirmSubscription();
    } else {
      setStatus('error');
      setMessage('Missing verification token.');
    }
  }, [token, navigate]);

  return (
    <div className="confirmation-page" style={{
      maxWidth: "600px",
      margin: "40px auto",
      padding: "30px",
      borderRadius: "15px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      backgroundColor: "white",
      textAlign: "center"
    }}>
      <h1 style={{
        color: status === 'success' ? "#4CAF50" : "#F44336",
        marginBottom: "30px",
        fontSize: "2rem"
      }}>
        {status === 'success' ? 'Subscription Confirmed!' : 'Verification Issue'}
      </h1>
      
      <div style={{
        padding: "20px",
        marginBottom: "25px",
        borderRadius: "8px",
        backgroundColor: status === 'success' ? "#E8F5E9" : "#FFEBEE",
        color: status === 'success' ? "#2E7D32" : "#C62828",
        fontSize: "1.1rem",
        lineHeight: "1.6"
      }}>
        {message}
      </div>
      
      {status === 'success' && (
        <div style={{ marginTop: "20px" }}>
          <p>{"You'll be redirected to the homepage shortly..."}</p>
        </div>
      )}
      
      {status === 'error' && (
        <button
          onClick={() => navigate('/newsletter')}
          style={{
            backgroundColor: "#ff6f61",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          Back to Newsletter
        </button>
      )}
    </div>
  );
};

export default ConfirmSubscription;