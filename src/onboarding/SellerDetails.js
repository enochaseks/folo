import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OnboardingLayout from "./OnboardingLayout";

const SellerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    businessType: "",
    businessName: "",
    operationType: "",
    documents: [],
    socialHandle: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ 
      ...formData, 
      documents: [...formData.documents, ...e.target.files] 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.businessType || !formData.businessName || !formData.operationType) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (formData.operationType !== "online" && formData.documents.length === 0) {
      setError("Please upload required documents for verification");
      return;
    }
    
    navigate("/onboarding/seller-business", { 
      state: { 
        ...location.state,
        sellerDetails: formData 
      } 
    });
  };

  return (
    <OnboardingLayout currentStep={3} totalSteps={5}>
      <form onSubmit={handleSubmit} className="onboarding-form">
        <h2>Tell us about your business</h2>
        <p>This helps us verify your business and set up your seller account.</p>
        
        <div className="form-group">
          <label>Business Type</label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            required
          >
            <option value="">Select business type</option>
            <option value="grocery">Grocery Store</option>
            <option value="restaurant">Restaurant</option>
            <option value="service">Service Provider</option>
            <option value="retail">Retail Store</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Business Name</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>How do you operate?</label>
          <select
            name="operationType"
            value={formData.operationType}
            onChange={handleChange}
            required
          >
            <option value="">Select operation type</option>
            <option value="online">Online only</option>
            <option value="physical">Physical store</option>
            <option value="both">Both online and physical</option>
          </select>
        </div>
        
        {formData.operationType && formData.operationType !== "online" && (
          <div className="form-group">
            <label>
              Upload business documents (License, Permit, etc.)
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*,.pdf"
              required={formData.operationType !== "online"}
            />
            <small>We'll verify your documents but won't store them permanently</small>
            
            {formData.documents.length > 0 && (
              <div className="document-preview">
                <p>Selected documents:</p>
                <ul>
                  {formData.documents.map((doc, index) => (
                    <li key={index}>{doc.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {formData.operationType && formData.operationType !== "physical" && (
          <div className="form-group">
            <label>Business Social Media Handle (Optional)</label>
            <input
              type="text"
              name="socialHandle"
              value={formData.socialHandle}
              onChange={handleChange}
              placeholder="@yourbusiness"
            />
          </div>
        )}
        
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" className="continue-button">
          Continue
        </button>
      </form>
    </OnboardingLayout>
  );
};

export default SellerDetails;