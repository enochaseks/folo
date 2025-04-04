import React, { useContext } from "react";
import { AuthContext } from './AuthContext';
import ServiceManagement from "./ServiceManagement";

const ServiceManagementWrapper = ({ addService, onDeleteService }) => {
  const { user } = useContext(AuthContext); // Get user from context

  return (
    <ServiceManagement
      addService={addService}
      onDeleteService={onDeleteService}
      user={user} // Pass user as a prop
    />
  );
};

export default ServiceManagementWrapper;