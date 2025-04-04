import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom"; // Removed Router import
import { AuthProvider, AuthContext } from "./AuthContext";
import Navbar from "./components/navbar";
import ConfirmSubscription from "./pages/ConfirmSubscription";
import NewsletterPage from "./pages/NewsletterPage";
import BusinessSetup from "./components/BusinessSetup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import ServiceDetails from "./components/servicedetails";
import EditService from "./pages/EditService";
import Profile from "./pages/Profile";
import ConfirmEmail from "./components/ConfirmEmail";
import ProtectedRoute from "./components/ProtectedRoute";
import ServiceManagement from "./components/ServiceManagement";
import CategorySelection from "./components/CategorySelection";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CategoryDetails from "./category/CategoryDetails";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import About from "./pages/About";
import "./App.css";
import OneEyedReview from "./pages/OneEyedReview";
import Footer from "./components/footer";
import ServiceList from "./components/servicelist";
import { ServicesProvider } from "./components/ServicesContext";
import PropTypes from "prop-types";

// Import available icons
import groceriesHealthIcon from "./icons/groceries-health.png";
import beautyLifestyleIcon from "./icons/beauty-lifestyle.png";

// Define categories
const categories = [
  { name: "Groceries & Health", icon: groceriesHealthIcon },
  { name: "Beauty & Lifestyle", icon: beautyLifestyleIcon },
];

// Define ServiceManagementWrapper inside App.js
const ServiceManagementWrapper = ({ addService, onDeleteService }) => {
  const { user } = useContext(AuthContext);

  return (
    <ServiceManagement
      addService={addService}
      onDeleteService={onDeleteService}
      user={user}
    />
  );
};

ServiceManagementWrapper.propTypes = {
  addService: PropTypes.func.isRequired,
  onDeleteService: PropTypes.func.isRequired,
};

function App() {
  const navigate = useNavigate();
  const [services, setServices] = useState(() => {
    const savedServices = localStorage.getItem("services");
    return savedServices ? JSON.parse(savedServices) : [];
  });
  const [deletedServices, setDeletedServices] = useState(
    JSON.parse(localStorage.getItem("deletedServices")) || []
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    const isProtectedRoute = ['/profile', '/manage-services'].includes(window.location.pathname);
    
    if (isProtectedRoute && (!token || !refreshToken)) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem("deletedServices", JSON.stringify(deletedServices));
  }, [deletedServices]);

  const addService = (newService) => {
    const updatedServices = [...services, newService];
    console.log("Updated Services in App:", updatedServices);
    setServices(updatedServices);
    localStorage.setItem("services", JSON.stringify(updatedServices));
  };

  const deleteService = (serviceId) => {
    const serviceToDelete = services.find((service) => service.id === serviceId);
    if (serviceToDelete) {
      setDeletedServices([
        ...deletedServices,
        { ...serviceToDelete, deletedAt: new Date() },
      ]);
      setServices(services.filter((service) => service.id !== serviceId));
    }
  };

  const restoreService = (serviceId) => {
    const serviceToRestore = deletedServices.find(
      (service) => service.id === serviceId
    );
    if (serviceToRestore) {
      setServices([...services, serviceToRestore]);
      setDeletedServices(
        deletedServices.filter((service) => service.id !== serviceId)
      );
    }
  };

  const permanentlyDeleteService = (serviceId) => {
    setDeletedServices(
      deletedServices.filter((service) => service.id !== serviceId)
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDeletedServices((prevServices) =>
        prevServices.filter((service) => {
          const deletedAt = new Date(service.deletedAt);
          const diffTime = Math.abs(now - deletedAt);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 30;
        })
      );
    }, 1000 * 60 * 60 * 24);

    return () => clearInterval(interval);
  }, []);

  const updateService = (updatedService) => {
    setServices(
      services.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
  };

  return (
    <ServicesProvider>
      <AuthProvider>
        {/* Removed Router wrapper since it's now in index.js */}
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Home services={services} addService={addService} />}
          />
          <Route
            path="/setup-business/:category"
            element={
              <BusinessSetup services={services} setServices={setServices} />
            }
          />
          <Route path="/confirm-subscription/:token" element={<ConfirmSubscription />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/servicelist"
            element={<ServiceList categories={categories} />}
          />
          <Route
            path="/category/:categoryName"
            element={<CategoryDetails services={services} />}
          />
          <Route
            path="/service/:id"
            element={
              <ServiceDetails
                services={services}
                onDeleteService={deleteService}
                onEditService={updateService}
              />
            }
          />
          <Route path="/one-eyed-review" element={<OneEyedReview />} />
          <Route
            path="/edit-service/:id"
            element={
              <EditService
                services={services}
                onUpdateService={updateService}
              />
            }
          />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/profile"
              element={
                <Profile
                  services={services}
                  addService={addService}
                  deletedServices={deletedServices}
                  restoreService={restoreService}
                  permanentlyDeleteService={permanentlyDeleteService}
                />
              }
            />
            <Route
              path="/manage-services"
              element={
                <ServiceManagementWrapper
                  addService={addService}
                  onDeleteService={deleteService}
                />
              }
            />
          </Route>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/create-service" element={<CategorySelection />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </ServicesProvider>
  );
}

export default App;