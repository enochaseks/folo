import React, { useState, useEffect, useCallback } from "react";
import ServiceList from "../components/servicelist";
import PropTypes from "prop-types";

const Home = ({ services = [], addService }) => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  // Load search history from localStorage
  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setSearchHistory(savedSearches);
  }, []);

  // Fetch user location
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLocationError(null);

    const geolocationTimeout = setTimeout(() => {
      setLocationError("Location request timed out. Please enable location services or try again.");
      setIsLoading(false);
    }, 10000);

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted") {
        console.log("Location access granted.");
      } else if (result.state === "prompt") {
        console.log("Location access not yet granted. Prompting user...");
      } else if (result.state === "denied") {
        console.log("Location access denied.");
        setLocationError("Location access denied. Please enable location services in your browser settings.");
        setIsLoading(false);
        clearTimeout(geolocationTimeout);
      }
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Location fetched:", position);
        clearTimeout(geolocationTimeout);
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        clearTimeout(geolocationTimeout);
        console.error("Error getting location:", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied. Please enable location services.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out. Please try again.");
            break;
          default:
            setLocationError("An unknown error occurred while fetching your location.");
            break;
        }
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Fetch location on component mount
  useEffect(() => {
    getLocation();
  }, [getLocation]);

  // Handle search input changes
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      const searches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      const newSearches = [searchQuery, ...searches.filter((s) => s !== searchQuery)].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(newSearches));
      setSearchHistory(newSearches);
    }
  }, [searchQuery]);

  // Filter services based on search query
  const filteredServices = services.filter((service) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      service.category?.toLowerCase().includes(searchLower) ||
      service.description?.toLowerCase().includes(searchLower) ||
      service.items?.some((item) => item.name?.toLowerCase().includes(searchLower))
    );
  });

  // Calculate distance between two coordinates (in km)
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }, []);

  // Filter services based on proximity to the user's location
  const getNearbyServices = useCallback(
    (services, userLocation, maxDistance = 50) => {
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

        console.log(`Distance to ${service.businessName}: ${distance.toFixed(2)} km`);
        return distance <= maxDistance;
      });
    },
    [calculateDistance]
  );

  // Get nearby services
  const nearbyServices = location ? getNearbyServices(filteredServices, location) : filteredServices;

  return (
    <div style={{ padding: "20px", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Search Bar */}
      <div style={{ position: "relative", marginBottom: "20px", width: "100%" }}>
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          style={{ 
            width: "100%", 
            padding: "10px", 
            borderRadius: "25px", 
            border: "1px solid #ccc", 
            outline: "none", 
            paddingRight: "40px",
            fontSize: "16px", // Adjust font size for better readability
            boxSizing: "border-box",
          }}
        />
        <button 
          onClick={handleSearch} 
          style={{ 
            position: "absolute", 
            right: "10px", 
            top: "50%", 
            transform: "translateY(-50%)", 
            background: "transparent", 
            border: "none", 
            cursor: "pointer", 
            color: "#666",
            fontSize: "16px", // Match font size with input
          }} 
          aria-label="Search"
        >
          Search
        </button>

        {/* Search Suggestions */}
        {searchQuery && searchHistory.length > 0 && (
          <div style={{ 
            position: "absolute", 
            top: "100%", 
            left: 0, 
            right: 0, 
            backgroundColor: "white", 
            borderRadius: "0 0 10px 10px", 
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)", 
            zIndex: 1000, 
            marginTop: "5px",
            width: "100%",
            boxSizing: "border-box",
          }}>
            {searchHistory.map((term, index) => (
              <div
                key={index}
                onClick={() => {
                  setSearchQuery(term);
                  handleSearch();
                }}
                style={{ 
                  padding: "10px 15px", 
                  cursor: "pointer", 
                  color: "#333", 
                  transition: "background-color 0.2s", 
                  ":hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                {term}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service List */}
      {isLoading ? (
        <p>Loading your location...</p>
      ) : locationError ? (
        <div>
          <p style={{ color: "red" }}>{locationError}</p>
          <button 
            onClick={getLocation} 
            style={{ 
              marginTop: "10px", 
              padding: "10px", 
              backgroundColor: "#e74c3c", 
              color: "white", 
              border: "none", 
              borderRadius: "5px", 
              cursor: "pointer",
            }}
          >
            Retry Location Request
          </button>
        </div>
      ) : location ? (
        <ServiceList location={location} services={nearbyServices} />
      ) : (
        <p>Unable to determine your location.</p>
      )}
    </div>
  );
};

// Add prop-types validation
Home.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      category: PropTypes.string,
      description: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          price: PropTypes.string.isRequired,
        })
      ),
      location: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      }),
    })
  ).isRequired,
  addService: PropTypes.func.isRequired,
};

export default Home;