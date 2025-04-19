import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSpinner, FaBuilding, FaGlobe, FaInfoCircle, FaFileUpload } from "react-icons/fa";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../pages/firebase";
import OnboardingLayout from "./OnboardingLayout";

// Import business origins from BusinessSetup
const africanCountries = `
  Algeria, Angola, Benin, Botswana, Burkina Faso, Burundi, Cabo Verde, Cameroon,
  Central African Republic, Chad, Comoros, Congo, Côte d'Ivoire, Djibouti, Egypt,
  Equatorial Guinea, Eritrea, Eswatini, Ethiopia, Gabon, Gambia, Ghana, Guinea,
  Guinea-Bissau, Kenya, Lesotho, Liberia, Libya, Madagascar, Malawi, Mali,
  Mauritania, Mauritius, Morocco, Mozambique, Namibia, Niger, Nigeria, Rwanda,
  Sao Tome and Principe, Senegal, Seychelles, Sierra Leone, Somalia, South Africa,
  South Sudan, Sudan, Tanzania, Togo, Tunisia, Uganda, Zambia, Zimbabwe
`.split(",").map((country) => country.trim());

const caribbeanIslands = `
  Anguilla, Antigua and Barbuda, Aruba, Bahamas, Barbados, Bonaire, British Virgin Islands,
  Cayman Islands, Cuba, Curaçao, Dominica, Dominican Republic, Grenada, Guadeloupe,
  Haiti, Jamaica, Martinique, Montserrat, Puerto Rico, Saba, Saint Barthélemy,
  Saint Kitts and Nevis, Saint Lucia, Saint Martin, Saint Vincent and the Grenadines,
  Sint Eustatius, Sint Maarten, Trinidad and Tobago, Turks and Caicos Islands, US Virgin Islands
`.split(",").map((island) => island.trim());

const otherRegions = `
  African French, Mixed French (African), Mixed French (Afro-Caribbean), Black French,
  African Italian, Black Italian, Caribbean Italian, Mixed Italian (African), Mixed Italian (Afro-Caribbean),
  African Spanish, Black Spanish, Caribbean Spanish, Mixed Spanish (African), Mixed Spanish (Afro-Caribbean),
  African Portuguese, Black Portuguese, Caribbean Portuguese, Mixed Portuguese (African), Mixed Portuguese (Afro-Caribbean),
  African German, Black German, Caribbean German, Mixed German (African), Mixed German (Afro-Caribbean),
  African Dutch, Black Dutch, Caribbean Dutch, Mixed Dutch (African), Mixed Dutch (Afro-Caribbean),
  African British, Black British, Caribbean British, Mixed British (African), Mixed British (Afro-Caribbean),
  African American, Black American, Caribbean American, Mixed American (African), Mixed American (Afro-Caribbean),
  African Canadian, Black Canadian, Caribbean Canadian, Mixed Canadian (African), Mixed Canadian (Afro-Caribbean),
  African Australian, Black Australian, Caribbean Australian, Mixed Australian (African), Mixed Australian (Afro-Caribbean)
`.split(",").map((region) => region.trim());

const businessOrigins = [
  ...africanCountries.map((country) => `African - ${country}`),
  ...caribbeanIslands.map((island) => `Caribbean - ${island}`),
  ...otherRegions,
];

const SellerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    businessOrigin: "",
    businessDescription: "",
    operationType: "",
    documents: [],
    socialHandle: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError("Each file must be less than 5MB");
        return false;
      }
      if (!file.type.match('image.*') && !file.type.match('application/pdf')) {
        setError("Please upload only image or PDF files");
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...validFiles]
      }));
      setError("");

      // Create preview URLs for images
      validFiles.forEach(file => {
        if (file.type.match('image.*')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewUrls(prev => [...prev, reader.result]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!formData.businessName || !formData.businessType || !formData.businessOrigin) {
        throw new Error("Please fill in all required fields");
      }

      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          ...formData,
          onboardingStep: 'setup-business-id',
          lastUpdated: new Date().toISOString()
        });
      }
      
      navigate("/onboarding/setup-business-id", { 
        state: { 
          ...location.state,
          ...formData
        } 
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={3} totalSteps={7}>
      <div className="onboarding-form">
        <h1>Seller Details</h1>
        <p className="subtext">
          Please provide some basic information about yourself and your business.
          This will help us create a better experience for you and your customers.
        </p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="businessName">
              <FaBuilding className="form-icon" /> Business Name
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="form-input"
              placeholder="What&apos;s your business called?"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="businessType">
              <FaInfoCircle className="form-icon" /> Business Type
            </label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select your business type</option>
              <option value="groceries">Groceries</option>
              <option value="cosmetics">Cosmetics</option>
              <option value="barber">Barber Services</option>
              <option value="nails">Nail Services</option>
              <option value="salon">Salon Services</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="businessOrigin">
              <FaGlobe className="form-icon" /> Business Origin
            </label>
            <select
              id="businessOrigin"
              name="businessOrigin"
              value={formData.businessOrigin}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select your business origin</option>
              {businessOrigins.map((origin) => (
                <option key={origin} value={origin}>
                  {origin}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="businessDescription">
              <FaInfoCircle className="form-icon" /> Business Description
            </label>
            <textarea
              id="businessDescription"
              name="businessDescription"
              value={formData.businessDescription}
              onChange={handleChange}
              className="form-input"
              placeholder="Tell us about your business..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="operationType">
              <FaInfoCircle className="form-icon" /> Operation Type
            </label>
            <select
              id="operationType"
              name="operationType"
              value={formData.operationType}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select your operation type</option>
              <option value="online">Online Only</option>
              <option value="physical">Physical Location</option>
              <option value="both">Both Online and Physical</option>
            </select>
          </div>
          
          {formData.operationType && formData.operationType !== "online" && (
            <div className="form-group">
              <label>
                <FaFileUpload className="form-icon" /> Upload business documents
              </label>
              <div className="file-upload-container">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  required={formData.operationType !== "online"}
                  className="file-input"
                />
                <label className="file-label">
                  Choose Files
                </label>
                {formData.documents.length > 0 && (
                  <div className="file-list">
                    {formData.documents.map((doc, index) => (
                      <span key={index} className="file-name">{doc.name}</span>
                    ))}
                  </div>
                )}
              </div>
              <small className="subtext">
                We&apos;ll verify your documents but won&apos;t store them permanently
              </small>
              
              {previewUrls.length > 0 && (
                <div className="preview-container">
                  {previewUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Document Preview ${index + 1}`} className="preview-image" />
                  ))}
                </div>
              )}
            </div>
          )}
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner" /> 
                Saving...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </div>
    </OnboardingLayout>
  );
};

export default SellerDetails;