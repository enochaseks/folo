import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ category, location }) => {
  // Mock data for demonstration
  const services = [
    {
      id: 1,
      name: "Example Salon",
      location: "London, UK",
      rating: 4.5,
      photo: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div>
      {services.map((service) => (
        <Link to={`/service/${service.id}`} key={service.id} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ margin: "10px 0", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
            <img src={service.photo} alt={service.name} style={{ width: "100%", borderRadius: "5px" }} />
            <h4>{service.name}</h4>
            <p>{service.location}</p>
            <p>Rating: {service.rating}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ServiceCard;