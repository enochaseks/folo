import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ServiceCard from "./servicecard";
import PropTypes from "prop-types";
import "../styles/global.css";
import { useServiceAI } from '../services/aiServiceManager';
import { usePaymentAI } from '../services/aiPaymentService';

// Icons and images
import groceriesHealthIcon from "../icons/groceries-health.png";
import beautyLifestyleIcon from "../icons/beauty-lifestyle.png";
import banner1 from "../images/banner4.jpg";
import banner2 from "../images/banner5.jpeg";
import banner3 from "../images/banner6.jpg";

// Categories
const categories = [
  { name: "Groceries & Health", icon: groceriesHealthIcon },
  { name: "Beauty & Lifestyle", icon: beautyLifestyleIcon },
];

// Banner images
const bannerImages = [banner1, banner2, banner3];

// Styles
const styles = {
  categoriesContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    padding: "10px 0",
    overflowX: "auto",
    whiteSpace: "nowrap",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  categoryButton: {
    padding: "10px 20px",
    borderRadius: "10px",
    backgroundColor: "#ff6f61",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    transition: "transform 0.2s, background-color 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    whiteSpace: "nowrap",
    cursor: "pointer",
    border: "2px solid #e74c3c",
    flex: "0 0 auto",
  },
  marketingBanner: {
    position: "relative",
    overflow: "hidden",
    height: "200px",
    borderRadius: "15px",
    margin: "20px 0",
    background: "linear-gradient(45deg, #ff9a9e, #fad0c4)",
  },
  bannerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0,
    transition: "opacity 1s ease-in-out",
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.3)",
    zIndex: 1,
  },
  bannerContent: {
    position: "relative",
    zIndex: 2,
    color: "white",
    textAlign: "center",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  ctaButton: {
    background: "red",
    color: "white",
    border: "none",
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: "bold",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.3s",
    marginTop: "15px",
    marginBottom: "-10px",
  },
  newsletterBanner: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "25px 20px",
    borderRadius: "15px",
    margin: "25px 0",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    background: "linear-gradient(135deg, #2c3e50 0%, #4a6491 100%)",
  },
  newsletterTitle: {
    fontSize: "1.8rem",
    marginBottom: "15px",
    color: "#ff6f61",
    fontWeight: "700",
  },
  newsletterText: {
    marginBottom: "20px",
    fontSize: "1.1rem",
    lineHeight: "1.5",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  newsletterButton: {
    backgroundColor: "#ff6f61",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: "30px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textDecoration: "none",
    display: "inline-block",
    marginTop: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    "&:hover": {
      backgroundColor: "#e74c3c",
      transform: "translateY(-3px)",
      boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
    },
  },
  servicesContainer: {
    display: "flex",
    overflowX: "scroll",
    gap: "15px",
    padding: "10px 0",
    scrollbarWidth: "thin",
    scrollbarColor: "#ff6f61 transparent",
    "&::-webkit-scrollbar": {
      height: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#ff6f61",
      borderRadius: "4px",
    },
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflow: "auto",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#ff6f61",
    fontWeight: "bold",
  },
};

const ServiceList = ({ services, location }) => {
  const { manageService } = useServiceAI();
  const { processPayment } = usePaymentAI();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [recommendedServices, setRecommendedServices] = useState([]);
  const [serviceQuality, setServiceQuality] = useState({});
  const [dynamicPricing, setDynamicPricing] = useState({});

  useEffect(() => {
    const loadAIRecommendations = async () => {
      try {
        const result = await manageService({
          services,
          location,
          userPreferences: JSON.parse(localStorage.getItem('userPreferences') || '{}')
        });

        if (result.success) {
          setRecommendedServices(result.recommendations);
          setServiceQuality(result.quality);
        }
      } catch (error) {
        console.error('AI recommendation error:', error);
      }
    };

    loadAIRecommendations();
  }, [services, location]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getNearbyServices = (services, userLocation, maxDistance = 50) => {
    if (!userLocation) return services;
    return services.filter((service) => {
      const serviceLocation = service.location;
      if (!serviceLocation) return false;
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        serviceLocation.latitude,
        serviceLocation.longitude
      );
      return distance <= maxDistance;
    });
  };

  const nearbyServices = location ? getNearbyServices(services, location) : services;

  const handleServiceSelection = async (service) => {
    try {
      const paymentResult = await processPayment({
        service,
        userHistory: localStorage.getItem('purchaseHistory'),
        marketConditions: serviceQuality[service.id]
      });

      if (paymentResult.success) {
        setDynamicPricing(prev => ({
          ...prev,
          [service.id]: paymentResult.price
        }));
      }
    } catch (error) {
      console.error('AI pricing error:', error);
    }
  };

  const handleSubscribe = () => {
    console.log('Subscribing...');
  };

  return (
    <div style={{ padding: "0 15px" }}>
      {/* Categories Section */}
      <div style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <Link
            key={index}
            to={`/category/${category.name.toLowerCase()}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="category-button" style={styles.categoryButton}>
              <img
                src={category.icon}
                alt={category.name}
                style={{ width: "30px", height: "30px" }}
              />
              <span>{category.name}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter Subscription Banner */}
      <div style={styles.newsletterBanner}>
        <h2 style={styles.newsletterTitle}>🚀 Get Early Access to Folo!</h2>
        <p style={styles.newsletterText}>
          Subscribe to our newsletter and be the first to access our platform when we launch.
          Receive exclusive offers, early-bird discounts, and updates on Black-owned businesses in your area.
        </p>
        <button 
          onClick={() => setShowSubscribeModal(true)}
          style={styles.newsletterButton}
          className="hover-effect"
        >
          Subscribe Now →
        </button>
      </div>

      {/* Services Near You Section */}
      <h2 style={{ margin: "25px 0 15px 0", fontSize: "1.8rem" }}>Services Near You</h2>
      <div style={styles.servicesContainer}>
        {nearbyServices.length > 0 ? (
          nearbyServices.map((service, i) => (
            <ServiceCard
              key={i}
              service={service}
              quality={serviceQuality[service.id]}
              dynamicPrice={dynamicPricing[service.id]}
              onSelect={() => handleServiceSelection(service)}
            />
          ))
        ) : (
          <p style={{ padding: "20px", textAlign: "center", width: "100%" }}>
            No services found near your location. Check back later or try a different area.
          </p>
        )}
      </div>

      {/* Recommended Services Section */}
      {recommendedServices.length > 0 && (
        <>
          <h2 style={{ margin: "25px 0 15px 0", fontSize: "1.8rem" }}>Recommended for You</h2>
          <div style={styles.servicesContainer}>
            {recommendedServices.map((service, i) => (
              <ServiceCard
                key={i}
                service={service}
                quality={serviceQuality[service.id]}
                dynamicPrice={dynamicPricing[service.id]}
                onSelect={() => handleServiceSelection(service)}
              />
            ))}
          </div>
        </>
      )}

      {/* Business Marketing Banner */}
      <div style={styles.marketingBanner}>
        {bannerImages.map((image, index) => (
          <div
            key={index}
            style={{
              ...styles.bannerImage,
              backgroundImage: `url(${image})`,
              opacity: index === currentImageIndex ? 0.5 : 0,
            }}
          />
        ))}
        <div style={styles.bannerOverlay} />
        <div style={styles.bannerContent}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", marginTop: "-20px" }}>
            Looking to boost your business?
          </h2>
          <p style={{ fontSize: "1rem", marginBottom: "-10px", marginTop: "5px" }}>
            Subscribe to us now for just £3.99 a month!
          </p>
          <button 
            style={styles.ctaButton}
            onClick={handleSubscribe}
          >
            Subscribe Now
          </button>
        </div>
      </div>

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button 
              onClick={() => setShowSubscribeModal(false)}
              style={styles.closeButton}
            >
              ×
            </button>
            <iframe 
              width="1080" 
              height="500" 
              src="https://sibforms.com/serve/MUIFAE0oWlv8Vn0vtprZLgalXJNGZhIrEkN2W32di54BD5_QeyyamMBz_D_vGCajgUcAWSyZbg2zGA6UM-6MXZ9RlwQrf4h7glmmcvr7eGlWUT9HsQ2TTpM3u99rMmAxkyYnh2ykGnq8vGywbOZ9-MQC1gI9Q-R--gM_NdjizwQJO7BsCjdrf4vcu635Y-8XyoTo8RxdSu5TX5zA" 
              frameBorder="0" 
              scrolling="auto" 
              allowFullScreen 
              style={{ 
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "100%",
                border: "none",
                borderRadius: "8px"
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

ServiceList.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
      businessName: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      location: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      }),
      phone: PropTypes.string,
      email: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          price: PropTypes.string.isRequired,
          photo: PropTypes.string,
        })
      ),
      photos: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  location: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
};

export default ServiceList;