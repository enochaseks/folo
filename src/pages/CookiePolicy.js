import React from "react";
import "../styles/global.css"; // Import the CSS file

const CookiePolicy = () => {
  return (
    <div className="legal-page">
      <h1>Cookie Policy</h1>
      <div className="policy-content">
        <p>
          <strong>Last Updated:</strong> 17/03/2025
        </p>
        <h2>1. Introduction</h2>
        <p>
          This Cookie Policy explains how Folo uses cookies and similar technologies to improve your experience on our platform.
        </p>
        <h2>2. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit our platform. They help us remember your preferences and analyze how you use our platform.
        </p>
        <h2>3. Types of Cookies We Use</h2>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for the platform to function.</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform.</li>
          <li><strong>Marketing Cookies:</strong> Used to deliver personalized ads.</li>
        </ul>
        <h2>4. Managing Cookies</h2>
        <p>
          You can control or delete cookies through your browser settings. However, disabling cookies may affect your experience on our platform.
        </p>
        <h2>5. Consent Requirements</h2>
        <p>
          Depending on your location, you may be required to provide consent for the use of cookies:
        </p>
        <ul>
          <li>
            <strong>European Union (GDPR):</strong> We obtain your consent before using non-essential cookies.
          </li>
          <li>
            <strong>Other Regions:</strong> Similar consent requirements may apply depending on local laws.
          </li>
        </ul>
        <h2>6. Changes to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on our platform.
        </p>
        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about this Cookie Policy, please contact us at <a href="mailto:contact@foloapp.co.uk">contact@foloapp.co.uk</a>.
        </p>
      </div>
    </div>
  );
};

export default CookiePolicy;