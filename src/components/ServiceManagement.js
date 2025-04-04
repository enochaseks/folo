import React, { useState } from "react"; // Removed useEffect
import PropTypes from "prop-types"; // Added for prop-types validation

const ServiceManagement = ({ addService, onDeleteService, user }) => {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  // Combined state for business setup and service management
  const [serviceData, setServiceData] = useState({
    // Business Setup
    category: "",
    businessType: "",
    businessName: "",
    businessOrigin: "",
    address: "",
    postCode: "",
    phone: "",
    email: "",
    
    // Service-Specific
    deliveryOption: "collection",
    ownVehicle: false,
    deliveryFee: "",
    currency: "GBP",
    requireDeposit: false,
    depositAmount: "",
    remoteOperation: false,
    socialMedia: { instagram: "", facebook: "", twitter: "" },
    documentation: null,
    
    // Item Management
    items: [],
    currentItem: { name: "", price: "", depositAmount: "", photo: null },
    photos: [],
  });

  

  // Category configurations
  const categories = {
    groceries: {
      name: "Groceries",
      types: [
        "Supermarkets & General Grocery Stores",
        "Wholesale Stores & Cash & Carry",
        "Butcher Shops & Meat Markets",
        "Fish Markets & Seafood Stores",
        "Specialty & Organic Stores",
        "Online Grocery Stores & Delivery Services"
      ]
    },
    cosmetics: {
      name: "Cosmetics",
      types: ["Makeup Artist", "Skincare Specialist", "Beauty Product Retailer"]
    }
  };

  const businessOrigins = [
    "Nigerian", "Ghanaian", "Jamaican", "Somali", "Ethiopian",
    "Kenyan", "South African", "Caribbean", "Other African"
  ];

  const currencies = ["GBP", "USD", "EUR", "NGN", "GHS", "KES"];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setServiceData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              files ? files[0] : value
    }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setServiceData(prev => ({
      ...prev,
      currentItem: { ...prev.currentItem, [name]: value }
    }));
  };

  const addItem = () => {
    if (serviceData.currentItem.name && serviceData.currentItem.price) {
      setServiceData(prev => ({
        ...prev,
        items: [...prev.items, prev.currentItem],
        currentItem: { name: "", price: "", depositAmount: "", photo: null }
      }));
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const photos = files.map(file => URL.createObjectURL(file));
    setServiceData(prev => ({
      ...prev,
      photos: [...prev.photos, ...photos]
    }));
  };

  const renderBusinessSetup = () => (
    <div className="form-section">
      <h3>Business Setup</h3>
      
      <div className="form-group">
        <label>Category *</label>
        <select
          name="category"
          value={serviceData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {Object.keys(categories).map(key => (
            <option key={key} value={key}>{categories[key].name}</option>
          ))}
        </select>
      </div>

      {serviceData.category && (
        <>
          <div className="form-group">
            <label>Business Type *</label>
            <select
              name="businessType"
              value={serviceData.businessType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              {categories[serviceData.category].types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Business Origin *</label>
            <select
              name="businessOrigin"
              value={serviceData.businessOrigin}
              onChange={handleChange}
              required
            >
              <option value="">Select Origin</option>
              {businessOrigins.map(origin => (
                <option key={origin} value={origin}>{origin}</option>
              ))}
            </select>
          </div>

          {/* Category-specific fields */}
          {serviceData.category === 'groceries' && (
            <div className="form-group">
              <label>Delivery Options</label>
              <div className="delivery-options">
                <label>
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="collection"
                    checked={serviceData.deliveryOption === 'collection'}
                    onChange={handleChange}
                  />
                  Collection Only
                </label>
                <label>
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="delivery"
                    checked={serviceData.deliveryOption === 'delivery'}
                    onChange={handleChange}
                  />
                  Offer Delivery
                </label>
                
                {serviceData.deliveryOption === 'delivery' && (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        name="ownVehicle"
                        checked={serviceData.ownVehicle}
                        onChange={handleChange}
                      />
                      Use Own Vehicle
                    </label>
                    {serviceData.ownVehicle && (
                      <p className="warning">
                        We are not liable for any damages to your vehicle
                      </p>
                    )}
                    
                    <div className="form-group">
                      <label>Delivery Fee ({serviceData.currency})</label>
                      <input
                        type="number"
                        name="deliveryFee"
                        value={serviceData.deliveryFee}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {serviceData.category === 'cosmetics' && (
            <>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="requireDeposit"
                    checked={serviceData.requireDeposit}
                    onChange={handleChange}
                  />
                  Require Deposit
                </label>
                {serviceData.requireDeposit && (
                  <input
                    type="number"
                    name="depositAmount"
                    value={serviceData.depositAmount}
                    onChange={handleChange}
                    placeholder="Deposit Amount"
                  />
                )}
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="remoteOperation"
                    checked={serviceData.remoteOperation}
                    onChange={handleChange}
                  />
                  Remote/Home-based Operation
                </label>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );

  const renderServiceDetails = () => (
    <div className="form-section">
      <h3>Service Details</h3>
      
      <div className="form-group">
        <label>Currency *</label>
        <select
          name="currency"
          value={serviceData.currency}
          onChange={handleChange}
          required
        >
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>

      <div className="item-management">
        <h4>Add Items</h4>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={serviceData.currentItem.name}
          onChange={handleItemChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={serviceData.currentItem.price}
          onChange={handleItemChange}
        />
        <input
          type="number"
          name="depositAmount"
          placeholder="Deposit Amount (Optional)"
          value={serviceData.currentItem.depositAmount}
          onChange={handleItemChange}
        />
        <button onClick={addItem}>Add Item</button>

        <div className="item-list">
          {serviceData.items.map((item, index) => (
            <div key={index} className="item">
              <span>
                {item.name} - {item.price}{serviceData.currency}
                {item.depositAmount && (
                  <span> (Deposit: {serviceData.currency} {item.depositAmount})</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="photo-upload">
        <h4>Upload Photos</h4>
        <input
          type="file"
          multiple
          onChange={handlePhotoUpload}
        />
        <div className="photo-preview">
          {serviceData.photos.map((photo, index) => (
            <img key={index} src={photo} alt={`Preview ${index}`} />
          ))}
        </div>
      </div>
    </div>
  );

  const handleSubmit = () => {
    const serviceWithUser = {
      ...serviceData,
      user: { id: user.id, name: user.name }
    };
    addService(serviceWithUser);
    // Reset form
    setServiceData({
      category: "",
      businessType: "",
      // ... reset all other fields
    });
  };

  return (
    <div className="service-management">
      <h2>Create New Service</h2>
      
      {renderBusinessSetup()}
      {renderServiceDetails()}

      <button 
        className="submit-btn"
        onClick={handleSubmit}
        disabled={!serviceData.items.length}
      >
        Publish Service
      </button>

      {showPremiumModal && (
        <div className="premium-modal">
          <h4>Premium Feature Required</h4>
          <p>Delivery fee management requires a premium subscription (£3.99/month)</p>
          <button onClick={() => setShowPremiumModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

// Add prop-types validation
ServiceManagement.propTypes = {
  addService: PropTypes.func.isRequired,
  onDeleteService: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default ServiceManagement;