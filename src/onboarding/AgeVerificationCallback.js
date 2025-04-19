import React, { useEffect } from 'react';

const AgeVerificationCallback = () => {
  useEffect(() => {
    const handleCallback = () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      // Get the stored state from localStorage
      const storedState = localStorage.getItem('idme_state');

      if (error) {
        console.error('ID.me verification error:', errorDescription);
        window.opener?.postMessage({ 
          error, 
          error_description: errorDescription,
          state: storedState // Include the stored state in the error response
        }, window.location.origin);
      } else if (code && state) {
        // Verify the state parameter matches
        if (state !== storedState) {
          console.error('State mismatch in callback:', { storedState, receivedState: state });
          window.opener?.postMessage({ 
            error: 'invalid_state',
            error_description: 'State parameter mismatch',
            state: storedState
          }, window.location.origin);
        } else {
          window.opener?.postMessage({ code, state }, window.location.origin);
        }
      }

      window.close();
    };

    handleCallback();
  }, []);

  return (
    <div className="callback-container">
      <h2>Verification in Progress</h2>
      <p>Please wait while we verify your identity...</p>
    </div>
  );
};

export default AgeVerificationCallback; 