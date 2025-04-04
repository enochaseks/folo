import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/service/${service.id}`);
  };

  return (
    <div style={{ margin: "10px 0", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
      {/* Thumbnail */}
      {service.thumbnail && (
        <img
          src={service.thumbnail}
          alt="Thumbnail"
          style={{ width: "100%", borderRadius: "5px", marginBottom: "10px" }}
        />
      )}

      {/* Business Name and Category */}
      <h4>{service.businessName}</h4>
      <p>Category: {service.category}</p>

      {/* Business Type */}
      {service.businessType && <p>Type: {service.businessType}</p>}

      {/* Location */}
      {service.address && (
        <p>
          Address: {service.address}, {service.postCode}, {service.country}
        </p>
      )}

      {/* Phone and Email */}
      {service.phone && <p>Phone: {service.phone}</p>}
      {service.email && <p>Email: {service.email}</p>}

      {/* Items */}
      {service.items && service.items.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h5>Items:</h5>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {service.items.map((item, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {item.photo && (
                  <img
                    src={item.photo}
                    alt={item.name}
                    style={{ width: "50px", height: "50px", borderRadius: "5px", marginRight: "10px" }}
                  />
                )}
                <span>
                  {item.name} - {service.currency} {item.price}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Services */}
      {service.services && service.services.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h5>Services:</h5>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {service.services.map((serviceItem, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {serviceItem.photo && (
                  <img
                    src={serviceItem.photo}
                    alt={serviceItem.name}
                    style={{ width: "50px", height: "50px", borderRadius: "5px", marginRight: "10px" }}
                  />
                )}
                <span>
                  {serviceItem.name} - {service.currency} {serviceItem.price}
                  {serviceItem.depositAmount && (
                    <span> (Deposit: {service.currency} {serviceItem.depositAmount})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Photos */}
      {service.photos && service.photos.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h5>Photos:</h5>
          <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
            {service.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Photo ${index}`}
                style={{ width: "100px", height: "100px", borderRadius: "5px" }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Link to Service Details */}
      <button
        onClick={handleViewDetails}
        style={{
          background: "green",
          color: "white",
          border: "none",
          padding: "5px 10px",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
          width: "100%",
        }}
      >
        View Details
      </button>
    </div>
  );
};

// Add prop-types validation
ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    thumbnail: PropTypes.string,
    businessName: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    businessType: PropTypes.string,
    address: PropTypes.string,
    postCode: PropTypes.string,
    country: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    currency: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        photo: PropTypes.string,
      })
    ),
    services: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        depositAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        photo: PropTypes.string,
      })
    ),
    photos: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ServiceCard;