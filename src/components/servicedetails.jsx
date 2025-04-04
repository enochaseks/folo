import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import PropTypes from "prop-types";
import "../styles/global.css";

const getCurrencySymbol = (currencyCode) => {
  switch (currencyCode) {
    // Global Currencies
    case "GBP":
      return "£";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "JPY":
      return "¥";
    case "AUD":
      return "A$";
    case "CAD":
      return "C$";
    case "CHF":
      return "CHF";
    case "CNY":
      return "¥";
    case "INR":
      return "₹";
    case "NZD":
      return "NZ$";

    // African Currencies
    case "NGN":
      return "₦";
    case "GHS":
      return "₵";
    case "KES":
      return "KSh";
    case "ZAR":
      return "R";
    case "EGP":
      return "E£";
    case "XOF":
      return "CFA";
    case "XAF":
      return "FCFA";
    case "MAD":
      return "MAD";
    case "TZS":
      return "TSh";
    case "UGX":
      return "USh";
    case "ETB":
      return "Br";
    case "ZMW":
      return "ZK";
    case "MWK":
      return "MK";
    case "RWF":
      return "RF";
    case "SLL":
      return "Le";
    case "LRD":
      return "L$";
    case "SZL":
      return "L";
    case "BWP":
      return "P";
    case "NAD":
      return "N$";
    case "MUR":
      return "₨";
    case "SCR":
      return "₨";
    case "CDF":
      return "FC";
    case "DJF":
      return "Fdj";
    case "SDG":
      return "SDG";
    case "SOS":
      return "S";
    case "STN":
      return "Db";
    case "AOA":
      return "Kz";
    case "MZN":
      return "MT";

    // Caribbean Currencies
    case "JMD":
      return "J$";
    case "TTD":
      return "TT$";
    case "BBD":
      return "Bds$";
    case "BSD":
      return "B$";
    case "KYD":
      return "CI$";
    case "XCD":
      return "EC$";
    case "HTG":
      return "G";
    case "AWG":
      return "ƒ";
    case "ANG":
      return "NAƒ";

    // Other Global Currencies
    case "BRL":
      return "R$";
    case "MXN":
      return "MX$";
    case "ARS":
      return "AR$";
    case "CLP":
      return "CLP$";
    case "COP":
      return "COL$";
    case "PEN":
      return "S/.";
    case "VES":
      return "Bs.";
    case "RUB":
      return "₽";
    case "TRY":
      return "₺";
    case "SAR":
      return "﷼";
    case "AED":
      return "د.إ";
    case "QAR":
      return "﷼";
    case "KRW":
      return "₩";
    case "SGD":
      return "S$";
    case "MYR":
      return "RM";
    case "THB":
      return "฿";
    case "IDR":
      return "Rp";
    case "PHP":
      return "₱";
    case "PKR":
      return "₨";
    case "BDT":
      return "৳";
    case "LKR":
      return "Rs";
    case "NPR":
      return "₨";
    case "MMK":
      return "K";
    case "KHR":
      return "៛";
    case "LAK":
      return "₭";
    case "VND":
      return "₫";
    case "HKD":
      return "HK$";
    case "TWD":
      return "NT$";

    // Default
    default:
      return currencyCode;
  }
};

const ServiceDetails = ({ services = [], onDeleteService }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [selectedItems, setSelectedItems] = useState([]);
  const reviews = [];

  // Log user and service data for debugging
  console.log("User:", user);
  const service = services.find((s) => s.id === parseInt(id)) || {
    items: [],
    services: [],
    photos: [],
    userId: null,
  };
  console.log("Service:", service);

  if (!service.id) {
    return <div className="service-not-found">Service not found</div>;
  }

  // Handle edit service
  const handleEditService = () => navigate(`/edit-service/${service.id}`);

  // Handle delete service
  const handleDeleteService = () => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      onDeleteService(service.id);
      navigate("/");
    }
  };

  // Handle item selection (for buyers)
  const handleItemSelection = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleAddReview = () => {
    navigate("/one-eyed-review", { state: { serviceId: service.id } });
  };

  // Check if the current user can edit or delete the service
  const canEditOrDelete =
    user &&
    (user.role === "admin" || (user.role === "seller" && user.id === service.userId));
  console.log("Can Edit/Delete:", canEditOrDelete);

  // Check if the current user is a buyer
  const isBuyer = user?.role === "buyer";
  console.log("Is Buyer:", isBuyer);

  // Render action buttons based on business type
  const renderActionButtons = () => {
    if (service.category === "groceries") {
      return (
        <div className="action-buttons">
          <button className="collection-button">Collection</button>
          {service.deliveryOption === "delivery" && (
            <button className="delivery-button">Delivery</button>
          )}
        </div>
      );
    } else if (
      ["cosmetics", "barber", "nails", "salon"].includes(service.category)
    ) {
      return (
        <div className="action-buttons">
          <button className="book-button">Book</button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="service-details-wrapper">
      <div className="service-details-container">
        {/* Thumbnail Image */}
        {service.thumbnail && (
          <img
            src={service.thumbnail}
            alt="Thumbnail"
            className="service-thumbnail"
          />
        )}

        {/* Business Information */}
        <div className="service-info">
          <p><strong>Business Name:</strong> {service.businessName || "N/A"}</p>
          <p><strong>Service Provider:</strong> {service.user?.name || "Unknown"}</p>
          <p><strong>Business Type:</strong> {service.businessType || "N/A"}</p>
          <p><strong>Business Origin:</strong> {service.businessOrigin || "N/A"}</p>
          <p><strong>Location:</strong> {service.address || "N/A"}</p>
          <p><strong>Phone:</strong> {service.phone || "N/A"}</p>
          <p><strong>Email:</strong> {service.email || "N/A"}</p>
          <p><strong>Currency:</strong> {service.currency || "N/A"}</p>
        </div>

        {/* Edit and Delete Buttons (for sellers/admins) */}
        {canEditOrDelete && (
          <div className="edit-delete-buttons">
            <button onClick={handleEditService} className="edit-button">
              Edit Service
            </button>
            <button onClick={handleDeleteService} className="delete-button">
              Delete Service
            </button>
          </div>
        )}

        {/* Action Buttons (Collection/Delivery/Book) */}
        {renderActionButtons()}
         
          {/* Add Review Button */}
        <button
          onClick={handleAddReview}
          style={{
            padding: "10px 20px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
            marginBottom: "20px"
          }}
        >
          Add Review
        </button>

        {/* Display Reviews */}
        <div>
          <h3>Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
                <p><strong>Rating:</strong> {review.rating}/5</p>
                <p><strong>Customer Service:</strong> {review.customerService}/5</p>
                <p><strong>Time Management:</strong> {review.timeManagement}/5</p>
                <p><strong>Price:</strong> {review.price}/5</p>
                <p><strong>Experience:</strong> {review.experience}/5</p>
                <p><strong>Description:</strong> {review.description}</p>
                <p><strong>Pros:</strong> {review.pros}</p>
                <p><strong>Cons:</strong> {review.cons}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to leave a review!</p>
          )}
        </div>

        {/* Items (for groceries) */}
        {service.category === "groceries" && (
          <>
            <h3 className="items-heading">Items</h3>
            {service.items.length > 0 ? (
              <ul className="items-list">
                {service.items.map((item, index) => (
                  <li key={index} className="item-card">
                    <div className="item-details">
                      {isBuyer && (
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item)}
                          onChange={() => handleItemSelection(item)}
                          className="item-checkbox"
                        />
                      )}
                      {item.photo && (
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="item-image"
                        />
                      )}
                      <span className="item-name-price">
                      {item.name} - {getCurrencySymbol(service.currency)} {item.price}
                      {item.depositAmount && (
                          <span> (Deposit: {getCurrencySymbol(service.currency)} {item.depositAmount})</span>
                      )}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-items">No items available.</p>
            )}
          </>
        )}

        {/* Services (for cosmetics, barber, nails, salon) */}
        {["cosmetics", "barber", "nails", "salon"].includes(service.category) && (
          <>
            <h3 className="items-heading">Services</h3>
            {service.services.length > 0 ? (
              <ul className="items-list">
                {service.services.map((serviceItem, index) => (
                  <li key={index} className="item-card">
                    <div className="item-details">
                      {serviceItem.photo && (
                        <img
                          src={serviceItem.photo}
                          alt={serviceItem.name}
                          className="item-image"
                        />
                      )}
                      <span className="item-name-price">
                        {serviceItem.name} - {getCurrencySymbol(service.currency)} {serviceItem.price}
                        {serviceItem.depositAmount && (
                          <span> (Deposit: {getCurrencySymbol(service.currency)} {serviceItem.depositAmount})</span>
                        )}
                      </span>
                    </div>
                  </li>
                ))}   
              </ul>
            ) : (
              <p className="no-items">No services available.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Add prop-types validation
ServiceDetails.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      businessName: PropTypes.string.isRequired,
      businessType: PropTypes.string.isRequired,
      businessOrigin: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      currency: PropTypes.string.isRequired,
      deliveryOption: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          price: PropTypes.string.isRequired,
          depositAmount: PropTypes.string,
          photo: PropTypes.string,
        })
      ),
      services: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          price: PropTypes.string.isRequired,
          depositAmount: PropTypes.string,
          photo: PropTypes.string,
        })
      ),
      thumbnail: PropTypes.string,
      userId: PropTypes.number.isRequired,
    })
  ).isRequired,
  onDeleteService: PropTypes.func.isRequired,
};

export default ServiceDetails;