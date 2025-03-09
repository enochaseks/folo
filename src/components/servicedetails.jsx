import React from "react";
import { useParams } from "react-router-dom";

const ServiceDetails = () => {
  const { id } = useParams();
  // Fetch service details based on ID (mock data for now)
  const service = {
    id: 1,
    name: "Example Salon",
    location: "London, UK",
    rating: 4.5,
    photo: "https://via.placeholder.com/150",
    reviews: ["Great service!", "Highly recommended."],
    options: ["Haircut", "Braiding"],
    phone: "123-456-7890",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{service.name}</h1>
      <img src={service.photo} alt={service.name} style={{ width: "100%", borderRadius: "5px" }} />
      <p>Location: {service.location}</p>
      <p>Rating: {service.rating}</p>
      <h3>Reviews</h3>
      <ul>
        {service.reviews.map((review, index) => (
          <li key={index}>{review}</li>
        ))}
      </ul>
      <h3>Options</h3>
      <ul>
        {service.options.map((option, index) => (
          <li key={index}>{option}</li>
        ))}
      </ul>
      <p>Phone: {service.phone}</p>
      <button style={{ padding: "10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "5px" }}>
        Book Now
      </button>
    </div>
  );
};

export default ServiceDetails;