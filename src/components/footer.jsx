import React from "react";
import { Link } from "react-router-dom";
import "../styles/global.css"; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/about">About</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms-of-service">Terms of Service</Link>
        <Link to="/cookie-policy">Cookie Policy</Link>
      </div>
      <p className="footer-text">
        &copy; {new Date().getFullYear()} Folo. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;