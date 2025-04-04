import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import PropTypes from "prop-types";
import "../styles/global.css";
import { useServiceAI, useAI } from '../services/aiServiceManager';

// List of all 54 African countries, Caribbean islands, and other regions
const africanCountries = `
  Algeria, Angola, Benin, Botswana, Burkina Faso, Burundi, Cabo Verde, Cameroon,
  Central African Republic, Chad, Comoros, Congo, Côte d'Ivoire, Djibouti, Egypt,
  Equatorial Guinea, Eritrea, Eswatini, Ethiopia, Gabon, Gambia, Ghana, Guinea,
  Guinea-Bissau, Kenya, Lesotho, Liberia, Libya, Madagascar, Malawi, Mali,
  Mauritania, Mauritius, Morocco, Mozambique, Namibia, Niger, Nigeria, Rwanda,
  Sao Tome and Principe, Senegal, Seychelles, Sierra Leone, Somalia, South Africa,
  South Sudan, Sudan, Tanzania, Togo, Tunisia, Uganda, Zambia, Zimbabwe
`
  .split(",")
  .map((country) => country.trim());

const caribbeanIslands = `
  Anguilla, Antigua and Barbuda, Aruba, Bahamas, Barbados, Bonaire, British Virgin Islands,
  Cayman Islands, Cuba, Curaçao, Dominica, Dominican Republic, Grenada, Guadeloupe,
  Haiti, Jamaica, Martinique, Montserrat, Puerto Rico, Saba, Saint Barthélemy,
  Saint Kitts and Nevis, Saint Lucia, Saint Martin, Saint Vincent and the Grenadines,
  Sint Eustatius, Sint Maarten, Trinidad and Tobago, Turks and Caicos Islands, US Virgin Islands
`
  .split(",")
  .map((island) => island.trim());

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
  African Australian, Black Australian, Caribbean Australian, Mixed Australian (African), Mixed Australian (Afro-Caribbean),
  Mixed Japanese (African), Mixed Japanese (Afro-Caribbean), Mixed Japanese (Black American), Mixed Chinese (African), 
  Mixed Chinese (Afro-Caribbean), Mixed Chinese (Black American), Mixed Korean (African), Mixed Korean (Afro-Caribbean),
  Mixed Korean (Black American), Mixed Vietnamese (African), Mixed Vietnamese (Afro-Caribbean), Mixed Vietnamese (Black American),
  Mixed Filipino (African), Mixed Filipino (Afro-Caribbean), Mixed Filipino (Black American), Mixed Indonesian (African),
  Mixed Indonesian (Afro-Caribbean), Mixed Indonesian (Black American), Mixed Malaysian (African), Mixed Malaysian (Afro-Caribbean),
  Mixed Malaysian (Black American), Mixed Thai (African), Mixed Thai (Afro-Caribbean), Mixed Thai (Black American),
  
`
  .split(",")
  .map((region) => region.trim());

const businessOrigins = [
  ...africanCountries.map((country) => `African - ${country}`),
  ...caribbeanIslands.map((island) => `Caribbean - ${island}`),
  ...otherRegions,
];

const currencies = [
  // Global Currencies
  { code: "GBP", name: "British Pound Sterling" },
  { code: "USD", name: "United States Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "INR", name: "Indian Rupee" },
  { code: "NZD", name: "New Zealand Dollar" },

  // African Currencies
  { code: "NGN", name: "Nigerian Naira" },
  { code: "GHS", name: "Ghanaian Cedi" },
  { code: "KES", name: "Kenyan Shilling" },
  { code: "ZAR", name: "South African Rand" },
  { code: "EGP", name: "Egyptian Pound" },
  { code: "XOF", name: "West African CFA Franc" },
  { code: "XAF", name: "Central African CFA Franc" },
  { code: "MAD", name: "Moroccan Dirham" },
  { code: "TZS", name: "Tanzanian Shilling" },
  { code: "UGX", name: "Ugandan Shilling" },
  { code: "ETB", name: "Ethiopian Birr" },
  { code: "ZMW", name: "Zambian Kwacha" },
  { code: "MWK", name: "Malawian Kwacha" },
  { code: "RWF", name: "Rwandan Franc" },
  { code: "SLL", name: "Sierra Leonean Leone" },
  { code: "LRD", name: "Liberian Dollar" },
  { code: "SZL", name: "Swazi Lilangeni" },
  { code: "BWP", name: "Botswana Pula" },
  { code: "NAD", name: "Namibian Dollar" },
  { code: "MUR", name: "Mauritian Rupee" },
  { code: "SCR", name: "Seychellois Rupee" },
  { code: "CDF", name: "Congolese Franc" },
  { code: "DJF", name: "Djiboutian Franc" },
  { code: "SDG", name: "Sudanese Pound" },
  { code: "SOS", name: "Somali Shilling" },
  { code: "STN", name: "São Tomé and Príncipe Dobra" },
  { code: "AOA", name: "Angolan Kwanza" },
  { code: "MZN", name: "Mozambican Metical" },

  // Caribbean Currencies
  { code: "JMD", name: "Jamaican Dollar" },
  { code: "TTD", name: "Trinidad and Tobago Dollar" },
  { code: "BBD", name: "Barbadian Dollar" },
  { code: "BSD", name: "Bahamian Dollar" },
  { code: "KYD", name: "Cayman Islands Dollar" },
  { code: "XCD", name: "East Caribbean Dollar" },
  { code: "HTG", name: "Haitian Gourde" },
  { code: "AWG", name: "Aruban Florin" },
  { code: "ANG", name: "Netherlands Antillean Guilder" },

  // Other Global Currencies
  { code: "BRL", name: "Brazilian Real" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "ARS", name: "Argentine Peso" },
  { code: "CLP", name: "Chilean Peso" },
  { code: "COP", name: "Colombian Peso" },
  { code: "PEN", name: "Peruvian Sol" },
  { code: "VES", name: "Venezuelan Bolívar" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "TRY", name: "Turkish Lira" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "AED", name: "United Arab Emirates Dirham" },
  { code: "QAR", name: "Qatari Riyal" },
  { code: "KRW", name: "South Korean Won" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "THB", name: "Thai Baht" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "BDT", name: "Bangladeshi Taka" },
  { code: "LKR", name: "Sri Lankan Rupee" },
  { code: "NPR", name: "Nepalese Rupee" },
  { code: "MMK", name: "Myanmar Kyat" },
  { code: "KHR", name: "Cambodian Riel" },
  { code: "LAK", name: "Laotian Kip" },
  { code: "VND", name: "Vietnamese Dong" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "TWD", name: "New Taiwan Dollar" },
];

const businessTypesByCategory = {
  groceries: [
    "Supermarkets & General Grocery Stores",
    "Wholesale Stores & Cash & Carry",
    "Butcher Shops & Meat Markets",
    "Fish Markets & Seafood Stores",
    "Specialty & Organic Stores",
    "Online Grocery Stores & Delivery Services",
  ],
  cosmetics: [
    "Makeup Artist",
    "Skincare Specialist",
    "Eyelash Technician",
    "Beauty Salon",
  ],
  barber: ["Traditional Barber", "Modern Barbershop", "Mobile Barber"],
  nails: ["Nail Salon", "Mobile Nail Technician", "Nail Art Specialist"],
  salon: ["Hair Stylist", "Loc Retwist"],
};

// Define getCurrencySymbol function here
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

const BusinessSetup = ({ services, setServices, categories = [] }) => {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { category } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { manageService } = useServiceAI();
  const { analyzeBusinessSetup } = useAI();
  const [aiSuggestions, setAiSuggestions] = useState({
    nameValidation: null,
    categorySuggestions: [],
    locationOptimization: null,
    marketAnalysis: null
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    location: "",
    targetMarket: "",
    businessType: "",
    businessOrigin: "",
    address: "",
    country: "",
    postCode: "",
    phone: "",
    email: "",
    currency: "GBP",
    deliveryOption: "collection",
    ownVehicle: false,
    deliveryFee: "",
    remoteOperation: false,
    runOnSocialMedia: false,
    socialMedia: { instagram: "", facebook: "", twitter: "" },
    documentation: null,
    willSellAlcohol: false,
    items: [],
    services: [],
    currentItem: { name: "", price: "", depositAmount: "", photo: null },
    currentService: { name: "", price: "", depositAmount: "", photo: null },
    thumbnail: null,
    userId: user?.id || 1,
    calendar: { availableDays: [], bookedSlots: [], daysOff: [] },
  });

  const validCategory = Object.keys(businessTypesByCategory).includes(category?.toLowerCase());

  useEffect(() => {
    if (!validCategory) {
      console.error('Invalid category:', category);
      // You might want to redirect or show an error message here
    }
  }, [category, validCategory]);

  useEffect(() => {
    const analyzeBusiness = async () => {
      if (formData.businessName && formData.category && formData.location && formData.targetMarket) {
        setIsAnalyzing(true);
        try {
          const result = await analyzeBusinessSetup(formData);
          if (result.success) {
            setAiSuggestions(result.recommendations);
          }
        } catch (error) {
          console.error('AI analysis error:', error);
        } finally {
          setIsAnalyzing(false);
        }
      }
    };

    const debounceTimer = setTimeout(analyzeBusiness, 1000);
    return () => clearTimeout(debounceTimer);
  }, [formData, analyzeBusinessSetup]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleChange = (e, nestedObject) => {
    const { name, value, type, checked, files } = e.target;

    if (nestedObject) {
      setFormData((prev) => ({
        ...prev,
        [nestedObject]: {
          ...prev[nestedObject],
          [name]: type === "checkbox" ? checked : files ? files[0] : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : files ? files[0] : value,
      }));
    }
  };

  const handleFileUpload = (e, field, nestedObject) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          [nestedObject]: {
            ...prev[nestedObject],
            [field]: event.target.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addService = () => {
    if (formData.currentService.name && formData.currentService.price) {
      const newService = {
        name: formData.currentService.name,
        price: formData.currentService.price,
        depositAmount: formData.currentService.depositAmount || null,
        photo: formData.currentService.photo || "default_photo_url",
      };

      // Use manageService to handle the new service
      manageService({
        services: [...formData.services, newService],
        location: formData.location,
        userPreferences: {
          businessType: formData.businessType,
          targetMarket: formData.targetMarket
        }
      }).then(result => {
        if (result.success) {
          setFormData((prev) => ({
            ...prev,
            services: [...prev.services, newService],
            currentService: { name: "", price: "", depositAmount: "", photo: null },
          }));
        }
      }).catch(error => {
        console.error('Error managing service:', error);
      });
    }
  };

  const addItem = () => {
    if (formData.currentItem.name && formData.currentItem.price) {
      const newItem = {
        name: formData.currentItem.name,
        price: formData.currentItem.price,
        depositAmount: formData.currentItem.depositAmount || null, // Include depositAmount
        photo: formData.currentItem.photo || "default_photo_url",
      };

      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
        currentItem: { name: "", price: "", depositAmount: "", photo: null }, // Reset depositAmount
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.businessName || !formData.address || !formData.country || !formData.postCode) {
      alert("Please fill out all required fields.");
      return;
    }

    // Fetch latitude and longitude using OpenCage API
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          `${formData.address}, ${formData.postCode}, ${formData.country}`
        )}&key=bf8aec13476640758171ddb136386bec`
      );
      const data = await response.json();
      if (data.results?.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setFormData((prev) => ({
          ...prev,
          location: { latitude: lat, longitude: lng },
        }));

        // Create a new service object
        const newService = {
          id: Date.now(),
          category,
          businessName: formData.businessName,
          businessType: formData.businessType,
          businessOrigin: formData.businessOrigin,
          address: formData.address,
          country: formData.country,
          postCode: formData.postCode,
          phone: formData.phone,
          email: formData.email,
          currency: formData.currency,
          deliveryOption: formData.deliveryOption,
          ownVehicle: formData.ownVehicle,
          deliveryFee: formData.deliveryFee,
          remoteOperation: formData.remoteOperation,
          runOnSocialMedia: formData.runOnSocialMedia,
          socialMedia: formData.socialMedia,
          documentation: formData.documentation,
          items: formData.items,
          services: formData.services,
          thumbnail: formData.thumbnail,
          calendar: formData.calendar,
          userId: user?.id || 1,
          photos: category === "groceries"
            ? formData.items.map((item) => item.photo).filter((photo) => photo)
            : formData.services.map((s) => s.photo).filter((photo) => photo),
          ratings: [],
          location: { latitude: lat, longitude: lng },
        };

        // Update the services state
        setServices((prev) => [...prev, newService]);

        // Navigate to the category page
        navigate(`/category/${category}`);
      } else {
        console.error("Geocoding failed: No results found");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  // Render category-specific fields
  const renderCategorySpecificFields = () => {
    switch (category) {
      case "groceries":
        return (
          <>
            {/* Delivery Options */}
            <div className="form-group">
              <label>Delivery Options</label>
              <div className="delivery-options">
                <label>
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="collection"
                    checked={formData.deliveryOption === "collection"}
                    onChange={(e) => handleChange(e)}
                  />
                  Collection Only
                </label>
                <label>
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="delivery"
                    checked={formData.deliveryOption === "delivery"}
                    onChange={(e) => handleChange(e)}
                  />
                  Offer Delivery
                </label>
                {formData.deliveryOption === "delivery" && (
                  <>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="ownVehicle"
                          checked={formData.ownVehicle}
                          onChange={(e) => handleChange(e)}
                        />
                        Use Own Vehicle
                      </label>
                      {formData.ownVehicle && (
                        <p className="warning">
                          Foló is not liable for any damages to your vehicle.
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Delivery Fee ({formData.currency})</label>
                      <input
                        type="number"
                        name="deliveryFee"
                        value={formData.deliveryFee}
                        onChange={(e) => handleChange(e)}
                      />
                      {formData.deliveryFee && !formData.ownVehicle && (
                        <p className="warning">
                          Delivery fees require a premium subscription (£3.99/month).
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Alcohol Sales Question */}
            {[
              "Supermarkets & General Grocery Stores",
              "Wholesale Stores & Cash & Carry",
              "Specialty & Organic Stores",
              "Online Grocery Stores & Delivery Services",
            ].includes(formData.businessType) && (
              <div className="form-group">
                <label>Will you be selling alcohol?</label>
                <input
                  type="checkbox"
                  name="willSellAlcohol"
                  checked={formData.willSellAlcohol}
                  onChange={(e) => handleCheckboxChange(e)}
                />
                <span>{formData.willSellAlcohol ? "Yes" : "No"}</span>
              </div>
            )}

            {/* Alcohol License Verification */}
            {formData.willSellAlcohol && (
              <div className="form-group">
                <label>Alcohol License Verification</label>
                <input
                  type="file"
                  name="alcoholLicense"
                  onChange={(e) => handleFileUpload(e, "alcoholLicense")}
                  accept=".pdf,.jpg,.png"
                />
              </div>
            )}

            {/* Health & Safety Certification */}
            {(formData.businessType.includes("Butcher") ||
              formData.businessType.includes("Fish Market")) && (
              <div className="form-group">
                <label>Food Safety Certification</label>
                <input
                  type="file"
                  name="documentation"
                  onChange={(e) => handleFileUpload(e, "documentation")}
                  accept=".pdf,.jpg,.png"
                />
              </div>
            )}

            {/* Groceries Items */}
            <div className="form-group">
              <label>Add Items</label>
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                value={formData.currentItem.name}
                onChange={(e) => handleChange(e, "currentItem")}
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.currentItem.price}
                onChange={(e) => handleChange(e, "currentItem")}
              />
              {/* Remove depositAmount input for groceries */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "photo", "currentItem")}
              />
              <button type="button" onClick={addItem}>
                Add Item
              </button>
              <div className="item-list">
                {formData.items?.map((item, index) => (
                  <div key={index} className="item">
                    {item.photo && (
                      <img src={item.photo} alt={item.name} className="item-photo" />
                    )}
                    <p>
                      {item.name} - {formData.currency} {item.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case "cosmetics":
      case "barber":
      case "nails":
      case "salon":
        return (
          <>
            {/* Social Media */}
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="runOnSocialMedia"
                  checked={formData.runOnSocialMedia}
                  onChange={(e) => handleChange(e)}
                />
                Do you run your business remotely on social media?
              </label>
            </div>
            {formData.runOnSocialMedia && (
              <div className="form-group">
                <label>Social Media Handles</label>
                <input
                  type="text"
                  name="instagram"
                  placeholder="Instagram"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => handleChange(e, "socialMedia")}
                />
                <input
                  type="text"
                  name="facebook"
                  placeholder="Facebook"
                  value={formData.socialMedia.facebook}
                  onChange={(e) => handleChange(e, "socialMedia")}
                />
                <input
                  type="text"
                  name="twitter"
                  placeholder="Twitter"
                  value={formData.socialMedia.twitter}
                  onChange={(e) => handleChange(e, "socialMedia")}
                />
              </div>
            )}

            {/* Services */}
            <div className="form-group">
              <label>Add Services</label>
              <input
                type="text"
                name="name"
                placeholder="Service Name"
                value={formData.currentService.name}
                onChange={(e) => handleChange(e, "currentService")}
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.currentService.price}
                onChange={(e) => handleChange(e, "currentService")}
              />
              <input
                type="number"
                name="depositAmount"
                placeholder="Deposit Amount (Optional)"
                value={formData.currentService.depositAmount}
                onChange={(e) => handleChange(e, "currentService")}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "photo", "currentService")}
              />
              <button type="button" onClick={addService}>
                Add Service
              </button>
              <div className="service-list">
                {formData.services?.map((service, index) => (
                  <div key={index} className="service">
                    {service.photo && (
                      <img src={service.photo} alt={service.name} className="service-photo" />
                    )}
                    <p>
                      {service.name} - {getCurrencySymbol(formData.currency)} {service.price}
                      {service.depositAmount && (
                        <span> (Deposit: {getCurrencySymbol(formData.currency)} {service.depositAmount})</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="business-setup">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2>Set Up Your {category} Business</h2>
      <form onSubmit={handleSubmit}>
        {/* AI Suggestions Panel */}
        <div className="ai-suggestions">
          <h3>AI Recommendations</h3>
          {Object.entries(aiSuggestions).map(([key, value]) => (
            <div key={key} className="suggestion-item">
              <h4>{key}</h4>
              <p>{value}</p>
            </div>
          ))}
        </div>

        {/* Business Name */}
        <div className="form-group">
          <label>Business Name *</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            required
          />
          {aiSuggestions.nameValidation && (
            <div className="ai-suggestion">
              <p>{aiSuggestions.nameValidation}</p>
            </div>
          )}
        </div>

        {/* Business Type */}
        <div className="form-group">
          <label>Business Type *</label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={(e) => handleChange(e)}
            required
          >
            <option value="">Select Business Type</option>
            {(businessTypesByCategory[category?.toLowerCase()] || []).map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Business Origin */}
        <div className="form-group">
          <label>Business Origin *</label>
          <select
            name="businessOrigin"
            value={formData.businessOrigin}
            onChange={(e) => handleChange(e)}
            required
          >
            <option value="">Select Business Origin</option>
            {businessOrigins.map((origin, index) => (
              <option key={index} value={origin}>
                {origin}
              </option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={(e) => handleChange(e)}
            placeholder="Enter your full address (e.g., 10 Downing Street, London, SW1A 2AA)"
            required
          />
        </div>

        {/* Country */}
        <div className="form-group">
          <label>Country *</label>
          <select
            name="country"
            value={formData.country}
            onChange={(e) => handleChange(e)}
            required
          >
            <option value="">Select Country</option>
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="FR">France</option>
          </select>
        </div>

        {/* Post Code */}
        <div className="form-group">
          <label>Post Code *</label>
          <input
            type="text"
            name="postCode"
            value={formData.postCode}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>

        {/* Currency */}
        <div className="form-group">
          <label>Currency *</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={(e) => handleChange(e)}
            required
          >
            {currencies.map((currency, index) => (
              <option key={index} value={currency.code}>
                {currency.name} ({currency.code})
              </option>
            ))}
          </select>
        </div>

        {/* Category-Specific Fields */}
        {renderCategorySpecificFields()}

        {/* Thumbnail Upload */}
        <div className="form-group">
          <label>Thumbnail (What buyers will see)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "thumbnail")}
          />
          {formData.thumbnail && (
            <img src={formData.thumbnail} alt="Thumbnail Preview" className="thumbnail-preview" />
          )}
        </div>

        {/* Calendar Options */}
        <div className="form-group">
          <label>Calendar Setup</label>
          <p>Buyers will select their preferred day and time.</p>
          <p>Manage your availability in the Notifications section.</p>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : 'Go Live'}
        </button>
      </form>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="premium-modal">
          <h4>Premium Feature Required</h4>
          <p>Delivery fee management requires a premium subscription (£3.99/month).</p>
          <button onClick={() => setShowPremiumModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

BusinessSetup.propTypes = {
  services: PropTypes.array.isRequired,
  setServices: PropTypes.func.isRequired,
  categories: PropTypes.array,
};

export default BusinessSetup;