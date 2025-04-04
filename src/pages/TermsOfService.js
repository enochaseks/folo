import React from "react";
import "../styles/global.css"; // Import the CSS file

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <h1>Terms of Service</h1>
      <div className="policy-content">
        <p>
          <strong>Last Updated:</strong> 17/03/2025
        </p>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By using Folo, you agree to these Terms of Service. If you do not agree, you may not use our platform.
        </p>
        <h2>2. Eligibility</h2>
        <ul>
          <li>You must be at least 18 years old to use the app.</li>
        </ul>
        <h2>3. User Responsibilities</h2>
        <p>
          You agree to:
        </p>
        <ul>
          <li>Provide accurate and complete information during registration.</li>
          <li>Use the platform only for lawful purposes.</li>
          <li>Not engage in any activity that disrupts or harms the platform.</li>
          <li>Be professional and treat everyone with respect, whether you are a buyer or seller.</li>
          <li>Provide legal information (if needed) when selling certain products or services on our platform.</li>
        </ul>
        <h2>4. Intellectual Property</h2>
        <p>
          All content on the platform (e.g., text, images, logos) is owned by us or our licensors. You may not use this content without our permission.
        </p>
        <h2>5. Limitation of Liability</h2>
        <p>
          We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
        </p>
        <h2>6. Termination</h2>
        <p>
          We may suspend or terminate your account if you violate these Terms of Service.
        </p>
        <h2>7. Changes to These Terms</h2>
        <p>
          We may update these Terms of Service from time to time. We will notify you of any changes by posting the new terms on our platform.
        </p>
        <h2>8. Governing Law</h2>
        <p>
          These Terms of Service are governed by the laws of the United Kingdom. However, if you are located in a different jurisdiction, the laws of your region may also apply.
        </p>
        <h2>9. Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at <a href="mailto:contact@foloapp.co.uk">contact@foloapp.co.uk</a>.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;