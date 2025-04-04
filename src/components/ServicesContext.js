import React, { createContext, useState } from "react";
import PropTypes from "prop-types"; // Add PropTypes import

export const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState([]);

  return (
    <ServicesContext.Provider value={{ services, setServices }}>
      {children}
    </ServicesContext.Provider>
  );
};

// Add prop-types validation for children
ServicesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};