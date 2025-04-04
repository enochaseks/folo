import React from "react";
import "../styles/global.css"; // Import the CSS file

const About = () => {
  return (
    <div className="legal-page">
      <h1>About Folo</h1>
      <div className="policy-content">
        <p>
          <strong>Welcome to Folo!</strong>
        </p>
        <p>
          Folo (fò lọ which means &quot;fly away&quot; in Yoruba) is an e-commerce marketplace dedicated to promoting and supporting African, Caribbean, and Black-owned businesses and services. Our mission is to create a platform where these businesses can thrive and connect with a global audience.
        </p>
        <h2>Our Vision</h2>
        <p>
          We envision a world where Black-owned businesses have equal opportunities to succeed and grow. By providing a dedicated platform, we aim to empower entrepreneurs and celebrate their contributions to the global economy.
        </p>
        <p>
          By doing this, we hope to motivate and inspire young Black people and the older generation from the diaspora to engage with our platform and make them feel secure in promoting their business and services on a global scale.
        </p>
        <h2>Our Values</h2>
        <ul>
          <li><strong>Community:</strong> We believe in building a strong, supportive community of buyers and sellers.</li>
          <li><strong>Empowerment:</strong> We are committed to empowering Black-owned businesses by providing them with the tools and resources they need to succeed.</li>
          <li><strong>Transparency:</strong> We operate with transparency and integrity in everything we do.</li>
        </ul>
        <h2>Contact Us</h2>
        <p>
          If you have any questions or need support, please feel free to contact us at <a href="mailto:contact@foloapp.co.uk">contact@foloapp.co.uk</a>.
        </p>
      </div>
    </div>
  );
};

export default About;