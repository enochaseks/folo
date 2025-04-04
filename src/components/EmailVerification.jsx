import React from 'react';
import PropTypes from 'prop-types';

const EmailVerificationTemplate = ({ verificationLink, userName }) => (
  <div style={emailStyles.container}>
    <h1 style={emailStyles.header}>Please Verify Your Email</h1>
    <div style={emailStyles.content}>
      {userName && <p>Hello {userName},</p>}
      <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
      
      <a 
        href={verificationLink} 
        style={emailStyles.button}
        target="_blank" 
        rel="noopener noreferrer"
      >
        Verify Email
      </a>
      
      <p style={emailStyles.smallText}>
        This link will expire in 24 hours. If you didn't request this verification, please ignore this email.
      </p>
      
      <div style={emailStyles.footer}>
        <p>You've received this email because you've signed up on our platform.</p>
        <p style={emailStyles.supportText}>
          Need help? Contact our <a href="mailto:support@yourdomain.com" style={emailStyles.link}>support team</a>
        </p>
      </div>
    </div>
  </div>
);

// PropTypes validation
EmailVerificationTemplate.propTypes = {
  verificationLink: PropTypes.string.isRequired,
  userName: PropTypes.string
};

// Enhanced styles
const emailStyles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: "'Arial', sans-serif",
    lineHeight: '1.6',
    color: '#333333',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  header: {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '24px',
    fontSize: '24px',
    fontWeight: '600'
  },
  content: {
    padding: '0 20px'
  },
  button: {
    display: 'block',
    width: '220px',
    margin: '25px auto',
    padding: '12px 24px',
    backgroundColor: '#0066ff',
    color: 'white',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
    ':hover': {
      backgroundColor: '#0052cc'
    }
  },
  smallText: {
    fontSize: '13px',
    color: '#666666',
    textAlign: 'center',
    margin: '20px 0'
  },
  footer: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eeeeee',
    fontSize: '12px',
    color: '#666666',
    textAlign: 'center'
  },
  supportText: {
    marginTop: '10px'
  },
  link: {
    color: '#0066ff',
    textDecoration: 'none'
  }
};

export default EmailVerificationTemplate;