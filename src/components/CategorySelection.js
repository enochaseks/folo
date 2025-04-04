// CategorySelection.js
import React from "react";
import { useNavigate } from "react-router-dom";

const categories = {
  groceries: "Groceries",
  cosmetics: "Cosmetics",
  barber: "Barber Services",
  nails: "Nail Technician",
  salon: "Salon Services"
};

const CategorySelection = () => {
  const navigate = useNavigate();

  return (
    <div className="category-selection">
      <h2>Select Your Service Category</h2>
      <div className="category-grid">
        {Object.entries(categories).map(([key, label]) => (
          <button 
            key={key}
            className="category-card"
            onClick={() => navigate(`/setup-business/${key}`)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;