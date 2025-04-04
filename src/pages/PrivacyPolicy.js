import React from "react";
import "../styles/global.css"; // Import the CSS file

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <h1>Privacy Policy</h1>
      <div className="policy-content">
        <p>
          <strong>Last Updated:</strong> 17/03/2025
        </p>
        <h2>1. Introduction</h2>
        <p>
          Welcome to Folo, an e-commerce marketplace that offers African, Caribbean, and Black-owned businesses and services to promote and sell their services. As part of our privacy policy, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and protect your data when you use our platform.
        </p>
        <h2>2. Information We Collect</h2>
        <p>
          We may collect the following types of information:
        </p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, date of birth, and other details you provide during registration.</li>
          <li><strong>Usage Data:</strong> Information about how you use our platform, such as pages visited and actions taken.</li>
          <li><strong>Device Information:</strong> IP address, browser type, and operating system.</li>
        </ul>
        <h2>3. How We Use Your Information</h2>
        <p>
          We use your information to:
        </p>
        <ul>
          <li>Provide and improve our services.</li>
          <li>Verify your age and eligibility for certain features.</li>
          <li>Communicate with you about your account and our services.</li>
          <li>Comply with legal obligations.</li>
        </ul>
        <h2>4. Sharing Your Information</h2>
        <p>
          We do not sell your personal information. We may share your data with:
        </p>
        <ul>
          <li>Service providers who help us operate our platform.</li>
          <li>Legal authorities if required by law.</li>
        </ul>
        <h2>5. Your Rights</h2>
        <p>
          Depending on your location, you may have the following rights:
        </p>
        <ul>
          <li>
            <strong>European Union (GDPR):</strong> Access, correct, or delete your personal information; withdraw consent; lodge a complaint with a data protection authority.
          </li>
          <li>
            <strong>California (CCPA):</strong> Opt out of the sale of your personal information; request disclosure of data collected.
          </li>
          <li>
            <strong>South Africa (POPIA):</strong> Access, correct, or delete your personal information; object to the processing of your data.
          </li>
          <li>
            <strong>Other Regions:</strong> Similar rights may apply depending on local laws.
          </li>
        </ul>
        <h2>6. Data Security</h2>
        <p>
          We use industry-standard measures to protect your data. However, no method of transmission over the internet is 100% secure.
        </p>
        <h2>7. International Data Transfers</h2>
        <p>
          Your data may be transferred to and processed in countries outside your region. We ensure that such transfers comply with applicable data protection laws.
        </p>
        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our platform.
        </p>
        <h2>9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:contact@foloapp.co.uk">contact@foloapp.co.uk</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;