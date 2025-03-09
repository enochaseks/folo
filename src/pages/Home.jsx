import React, { useState, useEffect } from "react";
import ServiceList from "../components/servicelist";

const Home = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Ask for user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to the Folo App</h1>
      {location ? (
        <ServiceList location={location} />
      ) : (
        <p>Loading your location...</p>
      )}
    </div>
  );
};

export default Home;