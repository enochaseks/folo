import React from "react";
import ServiceCard from "./servicecard";

const categories = ["Cosmetics", "Groceries", "Hair Salon", "Barbers", "Nail Technician"];

const ServiceList = ({ location }) => {
  return (
    <div>
      <h2>Services Near You</h2>
      <div style={{ display: "flex", overflowX: "scroll", gap: "10px" }}>
        {categories.map((category, index) => (
          <div key={index} style={{ minWidth: "200px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
            <h3>{category}</h3>
            <ServiceCard category={category} location={location} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;