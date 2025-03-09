// ConfirmEmail.jsx
import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      axios.get(`http://foloapp.com/api/confirm-email?token=${token}`)
        .then(() => {
          alert('Email confirmed successfully!');
          navigate('/login');
        })
        .catch((error) => {
          alert('Invalid or expired token.');
          navigate('/signup');
        });
    }
  }, [searchParams, navigate]);

  return <div>Confirming your email...</div>;
};

export default ConfirmEmail;