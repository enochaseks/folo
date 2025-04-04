import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import ServiceCard from "../components/servicecard";
import { ServicesContext } from "../components/ServicesContext";

const CategoryDetails = () => {
  const { services } = useContext(ServicesContext);
  const { categoryName } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("");

  const normalizedCategory = categoryName.toLowerCase().replace(/\s+/g, '-');

  // Filter services for the selected category (case-insensitive)
  let filteredServices = services.filter(service =>
    service.category.toLowerCase() === normalizedCategory
  );

  // Apply search filter
  if (searchQuery) {
    filteredServices = filteredServices.filter(service =>
      service.businessName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply additional filter based on category
  if (filterBy) {
    filteredServices = filteredServices.filter(service =>
      service.businessType === filterBy
    );
  }

  // Apply sorting
  filteredServices.sort((a, b) => {
    if (sortBy === "price") {
      return a.price - b.price;
    } else if (sortBy === "name") {
      return a.businessName.localeCompare(b.businessName);
    } else if (sortBy === "location") {
      return a.address.localeCompare(b.address);
    }
    return 0;
  });

  // Define filter options based on category
  const filterOptions = {
    "groceries-health": [
      "Supermarkets & General Grocery Stores",
      "Wholesale Stores & Cash & Carry",
      "Specialty & Organic Stores",
      "Online Grocery Stores & Delivery Services",
    ],
    "beauty-lifestyle": [
      "Barbers",
      "Nail Technician",
      "Hair Stylist",
      "Make Up Artist",
    ],
  };

  const currentFilterOptions = filterOptions[normalizedCategory] || [];

  // Handle empty results
  if (filteredServices.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>{categoryName}</h1>
        <p>No services found for this category.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{categoryName}</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "10px", width: "100%", maxWidth: "400px" }}
        />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Sort By:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="price">Price</option>
            <option value="name">Name A-Z</option>
            <option value="location">Location</option>
          </select>
        </label>
      </div>
      {currentFilterOptions.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <label>
            Filter By:
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              style={{ marginLeft: "10px", padding: "5px" }}
            >
              <option value="">All</option>
              {currentFilterOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <p>Showing {filteredServices.length} services</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {filteredServices.map((service, i) => (
          <ServiceCard key={i} service={service} />
        ))}
      </div>
    </div>
  );
};

export default CategoryDetails;