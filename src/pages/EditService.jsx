import React, { useState, useContext } from "react"; // Added useContext
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "../AuthContext";

const EditService = ({ services, onUpdateService }) => {
  const { id } = useParams();
  const { user, authAxios } = useContext(AuthContext); // Now properly using useContext
  const navigate = useNavigate();

  // Define grocery business types
  const groceryBusinessTypes = ["Supermarkets & General Grocery Stores", "Grocery Delivery Services"];

  // Find the service based on the ID
  const service = services.find((service) => service.id === parseInt(id));

  // State for editable fields
  const [editedService, setEditedService] = useState({
    businessName: service?.businessName || "",
    businessType: service?.businessType || "",
    businessOrigin: service?.businessOrigin || "",
    address: service?.address || "",
    country: service?.country || "",
    postCode: service?.postCode || "",
    phone: service?.phone || "",
    email: service?.email || "",
    currency: service?.currency || "GBP",
    deliveryOption: service?.deliveryOption || "collection",
    ownVehicle: service?.ownVehicle || false,
    deliveryFee: service?.deliveryFee || "",
    remoteOperation: service?.remoteOperation || false,
    runOnSocialMedia: service?.runOnSocialMedia || false,
    socialMedia: service?.socialMedia || { instagram: "", facebook: "", twitter: "" },
    documentation: service?.documentation || null,
    willSellAlcohol: service?.willSellAlcohol || false,
    items: service?.items || [],
    services: service?.services || [],
    thumbnail: service?.thumbnail || null,
    photos: service?.photos || [],
  });

  // Saving states
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Check if the business type is a grocery type
  const isGroceryBusiness = groceryBusinessTypes.includes(editedService.businessType);

  // State for adding a new item
  const [newItem, setNewItem] = useState({ name: "", price: "", photo: null });

  // State for adding a new service
  const [newService, setNewService] = useState({ name: "", price: "", depositAmount: "", photo: null });

  // Handle input changes for service details
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedService({ 
      ...editedService, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // Handle input changes for new item
  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handle input changes for new service
  const handleNewServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  // Handle service photo upload
  const handleServicePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = event.target.result;
        setEditedService({ ...editedService, photos: [newPhoto] });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle item photo upload
  const handleItemPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = event.target.result;
        setNewItem({ ...newItem, photo: newPhoto });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle new service photo upload
  const handleNewServicePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = event.target.result;
        setNewService({ ...newService, photo: newPhoto });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new item to the service
  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      const itemWithPhoto = { ...newItem, photo: newItem.photo || "https://via.placeholder.com/150" };
      setEditedService({
        ...editedService,
        items: [...editedService.items, itemWithPhoto],
      });
      setNewItem({ name: "", price: "", photo: null });
    }
  };

  // Add a new service to the service
  const handleAddService = () => {
    if (newService.name && newService.price) {
      const serviceWithPhoto = { ...newService, photo: newService.photo || "https://via.placeholder.com/150" };
      setEditedService({
        ...editedService,
        services: [...editedService.services, serviceWithPhoto],
      });
      setNewService({ name: "", price: "", depositAmount: "", photo: null });
    }
  };

  // Delete an item from the service
  const handleDeleteItem = (index) => {
    const updatedItems = editedService.items.filter((_, i) => i !== index);
    setEditedService({ ...editedService, items: updatedItems });
  };

  // Delete a service from the service
  const handleDeleteService = (index) => {
    const updatedServices = editedService.services.filter((_, i) => i !== index);
    setEditedService({ ...editedService, services: updatedServices });
  };

  // Validate form before submission
  const validateForm = () => {
    if (!editedService.businessName.trim()) {
      setSaveError("Business name is required");
      return false;
    }
    if (!editedService.businessType.trim()) {
      setSaveError("Business type is required");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
  
    try {
      console.log("Submitting:", editedService);
      const response = await authAxios.put(`/api/services/${service.id}`, {
        ...editedService,
        userId: user.id // Ensure user ID is included
      });
      
      console.log("Server response:", response.data); 
      onUpdateService(response.data);
      setSaveSuccess(true);
      setTimeout(() => navigate(`/service/${service.id}`), 1500);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to update service");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate(`/service/${service.id}`);
  };

  if (!service) {
    return <div style={{ padding: "20px" }}>Service not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.heading}>Edit Service</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Business Details */}
          <div style={styles.formGroup}>
            <label>Business Name:</label>
            <input
              type="text"
              name="businessName"
              value={editedService.businessName}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label>Business Type:</label>
            <input
              type="text"
              name="businessType"
              value={editedService.businessType}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Business Origin:</label>
            <input
              type="text"
              name="businessOrigin"
              value={editedService.businessOrigin}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={editedService.address}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={editedService.country}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Post Code:</label>
            <input
              type="text"
              name="postCode"
              value={editedService.postCode}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={editedService.phone}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editedService.email}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Currency:</label>
            <select
              name="currency"
              value={editedService.currency}
              onChange={handleInputChange}
              style={styles.input}
            >
              <option value="GBP">GBP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          {/* Delivery Options */}
          {isGroceryBusiness && (
            <>
              <div style={styles.formGroup}>
                <label>Delivery Options:</label>
                <select
                  name="deliveryOption"
                  value={editedService.deliveryOption}
                  onChange={handleInputChange}
                  style={styles.input}
                >
                  <option value="collection">Collection Only</option>
                  <option value="delivery">Offer Delivery</option>
                </select>
              </div>
              {editedService.deliveryOption === "delivery" && (
                <>
                  <div style={styles.formGroup}>
                    <label>
                      <input
                        type="checkbox"
                        name="ownVehicle"
                        checked={editedService.ownVehicle}
                        onChange={handleInputChange}
                      />
                      Use Own Vehicle
                    </label>
                  </div>
                  <div style={styles.formGroup}>
                    <label>Delivery Fee:</label>
                    <input
                      type="number"
                      name="deliveryFee"
                      value={editedService.deliveryFee}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Remote Operation */}
          <div style={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                name="remoteOperation"
                checked={editedService.remoteOperation}
                onChange={handleInputChange}
              />
              Remote Operation
            </label>
          </div>

          {/* Social Media */}
          {editedService.remoteOperation && (
            <div style={styles.formGroup}>
              <label>Social Media Handles:</label>
              <input
                type="text"
                name="instagram"
                placeholder="Instagram"
                value={editedService.socialMedia.instagram}
                onChange={(e) => setEditedService({ ...editedService, socialMedia: { ...editedService.socialMedia, instagram: e.target.value } })}
                style={styles.input}
              />
              <input
                type="text"
                name="facebook"
                placeholder="Facebook"
                value={editedService.socialMedia.facebook}
                onChange={(e) => setEditedService({ ...editedService, socialMedia: { ...editedService.socialMedia, facebook: e.target.value } })}
                style={styles.input}
              />
              <input
                type="text"
                name="twitter"
                placeholder="Twitter"
                value={editedService.socialMedia.twitter}
                onChange={(e) => setEditedService({ ...editedService, socialMedia: { ...editedService.socialMedia, twitter: e.target.value } })}
                style={styles.input}
              />
            </div>
          )}

          {/* Alcohol Sales */}
          {editedService.businessType === "Supermarkets & General Grocery Stores" && (
            <div style={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  name="willSellAlcohol"
                  checked={editedService.willSellAlcohol}
                  onChange={handleInputChange}
                />
                Will Sell Alcohol
              </label>
            </div>
          )}

          {/* Service Photos */}
          <div style={styles.formGroup}>
            <label>Service Photos:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleServicePhotoUpload}
              style={styles.input}
            />
            {editedService.photos.length > 0 && (
              <img
                src={editedService.photos[0]}
                alt="Service"
                style={{ width: "30%", borderRadius: "5px", marginTop: "10px" }}
              />
            )}
          </div>

          {/* Items List */}
          {isGroceryBusiness && (
            <>
              <h3>Items</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {editedService.items.map((item, index) => (
                  <li key={index} style={{ marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {item.photo && (
                          <img
                            src={item.photo}
                            alt={item.name}
                            style={{ width: "50px", height: "50px", borderRadius: "5px", marginRight: "10px" }}
                          />
                        )}
                        <span>
                          {item.name} - {editedService.currency} {item.price}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(index)}
                        style={{ padding: "5px 10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "5px" }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Add New Item */}
              <div style={styles.formGroup}>
                <h4>Add New Item</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Item Name"
                    value={newItem.name}
                    onChange={handleNewItemChange}
                    style={styles.input}
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={handleNewItemChange}
                    style={styles.input}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleItemPhotoUpload}
                    style={styles.input}
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    style={styles.button}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Services List */}
          {!isGroceryBusiness && (
            <>
              <h3>Services</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {editedService.services.map((serviceItem, index) => (
                  <li key={index} style={{ marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {serviceItem.photo && (
                          <img
                            src={serviceItem.photo}
                            alt={serviceItem.name}
                            style={{ width: "50px", height: "50px", borderRadius: "5px", marginRight: "10px" }}
                          />
                        )}
                        <span>
                          {serviceItem.name} - {editedService.currency} {serviceItem.price}
                          {serviceItem.depositAmount && (
                            <span> (Deposit: {editedService.currency} {serviceItem.depositAmount})</span>
                          )}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(index)}
                        style={{ padding: "5px 10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "5px" }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Add New Service */}
              <div style={styles.formGroup}>
                <h4>Add New Service</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Service Name"
                    value={newService.name}
                    onChange={handleNewServiceChange}
                    style={styles.input}
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={newService.price}
                    onChange={handleNewServiceChange}
                    style={styles.input}
                  />
                  <input
                    type="number"
                    name="depositAmount"
                    placeholder="Deposit Amount"
                    value={newService.depositAmount}
                    onChange={handleNewServiceChange}
                    style={styles.input}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewServicePhotoUpload}
                    style={styles.input}
                  />
                  <button
                    type="button"
                    onClick={handleAddService}
                    style={styles.button}
                  >
                    Add Service
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Save and Cancel Buttons */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                ...styles.cancelButton,
                opacity: isSaving ? 0.7 : 1,
              }}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                backgroundColor: isSaving ? "#6c757d" : "#007bff",
                opacity: isSaving ? 0.7 : 1,
              }}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {saveError && (
            <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
              {saveError}
            </div>
          )}
          {saveSuccess && (
            <div style={{ color: 'green', marginTop: '10px', textAlign: 'center' }}>
              Changes saved successfully! Redirecting...
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

EditService.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      businessName: PropTypes.string,
      businessType: PropTypes.string,
      businessOrigin: PropTypes.string,
      address: PropTypes.string,
      country: PropTypes.string,
      postCode: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string,
      currency: PropTypes.string,
      deliveryOption: PropTypes.string,
      ownVehicle: PropTypes.bool,
      deliveryFee: PropTypes.string,
      remoteOperation: PropTypes.bool,
      runOnSocialMedia: PropTypes.bool,
      socialMedia: PropTypes.shape({
        instagram: PropTypes.string,
        facebook: PropTypes.string,
        twitter: PropTypes.string,
      }),
      documentation: PropTypes.string,
      willSellAlcohol: PropTypes.bool,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          price: PropTypes.string.isRequired,
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
      photos: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  onUpdateService: PropTypes.func.isRequired,
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  formContainer: {
    width: "100%",
    maxWidth: "800px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    border: "1px solid #ccc",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "5px 10px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  submitButton: {
    padding: "10px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  cancelButton: {
    padding: "10px",
    backgroundColor: "gray",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default EditService;