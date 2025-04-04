import React, { useState, useEffect, useContext } from "react";
import { FaPlus, FaSearch, FaStar, FaEdit, FaTrash } from "react-icons/fa";
import PropTypes from "prop-types";
import { AuthContext } from "../AuthContext"; // Adjust the path as needed
import { useNavigate } from "react-router-dom"; // For redirecting to the login page
import OneEyedReviewLogo from '../images/OneEyedReview.png';

const OneEyedReview = () => {
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState([]); // State for reviews
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("all");
  const [editingReview, setEditingReview] = useState(null); // Track the review being edited
  const { user } = useContext(AuthContext); // Get the authenticated user
  const navigate = useNavigate(); // For redirecting to the login page

  // Fetch reviews from the backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setReviews(data);
        localStorage.setItem("reviews", JSON.stringify(data)); // Save to localStorage
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  // Save reviews to localStorage
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem("reviews", JSON.stringify(reviews));
    }
  }, [reviews]);

  // Load reviews from localStorage
  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem("reviews"));
    if (savedReviews) {
      setReviews(savedReviews);
    }
  }, []);

  // Handle adding or updating a review
  const handleAddReview = async (review) => {
    try {
      const url = editingReview !== null 
        ? `http://localhost:5000/api/reviews/${reviews[editingReview].id}` 
        : "http://localhost:5000/api/reviews";
      const method = editingReview !== null ? "PUT" : "POST";

      console.log("URL:", url); // Debugging
      console.log("Review Data:", review); // Debugging

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        const errorResponse = await response.json(); // Parse error response
        throw new Error(errorResponse.message || "Failed to save review");
      }

      const savedReview = await response.json();

      if (editingReview !== null) {
        const updatedReviews = reviews.map((r, index) =>
          index === editingReview ? savedReview : r
        );
        setReviews(updatedReviews);
        localStorage.setItem("reviews", JSON.stringify(updatedReviews)); // Update localStorage
      } else {
        setReviews([...reviews, savedReview]);
        localStorage.setItem("reviews", JSON.stringify([...reviews, savedReview]));
      }

      setEditingReview(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving review:", error);
      alert(`Error saving review: ${error.message}`); // Show error to user
    }
  };

  // Handle editing a review
  const handleEditReview = (index) => {
    const reviewToEdit = reviews[index];
    if (!reviewToEdit || !reviewToEdit.id) {
      console.error("Invalid review or review ID");
      return;
    }

    setEditingReview(index); // Set the review being edited
    setShowForm(true); // Open the form with the review data
  };

  // Handle deleting a review
  const handleDeleteReview = async (index) => {
    const reviewToDelete = reviews[index];
    console.log("Review to delete:", reviewToDelete);
    if (!reviewToDelete || !reviewToDelete.id) {
      console.error("Invalid review or review ID");
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorResponse = await response.json(); // Parse error response
        throw new Error(errorResponse.message || "Failed to delete review");
      }

      // Remove the review from the state
      const updatedReviews = reviews.filter((_, i) => i !== index);
      setReviews(updatedReviews);
      localStorage.setItem("reviews", JSON.stringify(updatedReviews)); // Update localStorage
    } catch (error) {
      console.error("Error deleting review:", error);
      alert(`Error deleting review: ${error.message}`); // Show error to user
    }
  };

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          size={20}
          color={i <= rating ? "#ffc107" : "#e4e5e9"}
        />
      );
    }
    return <div style={{ display: "flex", gap: "5px" }}>{stars}</div>;
  };

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      if (filterBy === "all") return true;
      return review.businessType === filterBy;
    })
    .filter((review) => {
      const name = review.businessName || ""; // Default to an empty string if undefined
      const type = review.businessType || ""; // Default to an empty string if undefined
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  // Handle Add Review Button Click
  const handleAddReviewClick = () => {
    if (!user) {
      // Redirect to the login page with a redirect URL
      navigate("/login?redirect=/reviews");
      return;
    }
    setEditingReview(null); // Reset editing state
    setShowForm(true); // Open the form
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Header with Title and Add Review Button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        {/* Add Review Button */}
        <button
          onClick={handleAddReviewClick}
          style={{
            padding: "10px 20px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <FaPlus /> Add Review
        </button>

        {/* Title with Stacked Text and Border */}
        <img 
          src={OneEyedReviewLogo} 
          alt="One Eyed Review Logo" 
          style={{
            height: '150px',
            width: 'auto',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Search Bar */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by business name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button
          style={{
            padding: "10px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          <FaSearch />
        </button>
      </div>

      {/* Sort and Filter */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="date">Sort by Date</option>
          <option value="rating">Sort by Rating</option>
        </select>
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="all">All Categories</option>
          <option value="groceries">Groceries</option>
          <option value="cosmetics">Cosmetics</option>
          <option value="barber">Barber</option>
          <option value="nails">Nails</option>
          <option value="salon">Salon</option>
        </select>
      </div>

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          onAddReview={handleAddReview}
          onClose={() => {
            setShowForm(false);
            setEditingReview(null); // Reset editing state
          }}
          reviewToEdit={editingReview !== null ? reviews[editingReview] : null} // Pass the review to edit
        />
      )}

      {/* Reviews List */}
      <div>
        {filteredReviews.map((review, index) => (
          <div key={index} style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h3>{review.businessName}</h3>
            <div>
              <strong>Category:</strong> {review.businessType}
            </div>
            <div>
              <strong>Rating:</strong> {renderStars(review.rating)}
            </div>
            <div>
              <strong>Customer Service:</strong> {renderStars(review.customerService)}
            </div>
            <div>
              <strong>Time Management:</strong> {renderStars(review.timeManagement)}
            </div>
            <div>
              <strong>Price:</strong> {renderStars(review.price)}
            </div>
            <div>
              <strong>Experience:</strong> {renderStars(review.experience)}
            </div>
            <div>
              <strong>Description:</strong> {review.description}
            </div>
            <div>
              <strong>Pros:</strong> {review.pros}
            </div>
            <div>
              <strong>Cons:</strong> {review.cons}
            </div>
            {/* Edit and Delete Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                onClick={() => handleEditReview(index)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDeleteReview(index)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ReviewForm Component
const ReviewForm = ({ onAddReview, onClose, reviewToEdit }) => {
  const [businessName, setBusinessName] = useState(reviewToEdit?.businessName || "");
  const [businessType, setBusinessType] = useState(reviewToEdit?.businessType || "groceries");
  const [customerService, setCustomerService] = useState(reviewToEdit?.customerService || 0);
  const [timeManagement, setTimeManagement] = useState(reviewToEdit?.timeManagement || 0);
  const [price, setPrice] = useState(reviewToEdit?.price || 0);
  const [experience, setExperience] = useState(reviewToEdit?.experience || 0);
  const [description, setDescription] = useState(reviewToEdit?.description || "");
  const [pros, setPros] = useState(reviewToEdit?.pros || "");
  const [cons, setCons] = useState(reviewToEdit?.cons || "");

  // Ensure form fields are updated when reviewToEdit changes
  useEffect(() => {
    if (reviewToEdit) {
      setBusinessName(reviewToEdit.businessName);
      setBusinessType(reviewToEdit.businessType);
      setCustomerService(reviewToEdit.customerService);
      setTimeManagement(reviewToEdit.timeManagement);
      setPrice(reviewToEdit.price);
      setExperience(reviewToEdit.experience);
      setDescription(reviewToEdit.description);
      setPros(reviewToEdit.pros);
      setCons(reviewToEdit.cons);
    }
  }, [reviewToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const review = {
      businessName,
      businessType,
      rating: (customerService + timeManagement + price + experience) / 4,
      customerService,
      timeManagement,
      price,
      experience,
      description,
      pros,
      cons,
      date: new Date().toISOString(),
      userId: 1, // Replace with a valid user ID
    };
    onAddReview(review);
  };

  // Function to render star rating input
  const renderStarRating = (label, value, setValue) => {
    return (
      <div style={{ marginBottom: "10px" }}>
        <label>{label}:</label>
        <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={20}
              color={star <= value ? "#ffc107" : "#e4e5e9"}
              onClick={() => setValue(star)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px", marginBottom: "20px" }}>
      <h2>{reviewToEdit ? "Edit Review" : "Add a Review"}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Business Name:</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Business Type:</label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            <option value="groceries">Groceries</option>
            <option value="cosmetics">Cosmetics</option>
            <option value="barber">Barber</option>
            <option value="nails">Nails</option>
            <option value="salon">Salon</option>
          </select>
        </div>

        {/* Star Ratings */}
        {renderStarRating("Customer Service", customerService, setCustomerService)}
        {renderStarRating("Time Management", timeManagement, setTimeManagement)}
        {renderStarRating("Price", price, setPrice)}
        {renderStarRating("Experience", experience, setExperience)}

        <div style={{ marginBottom: "10px" }}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Pros:</label>
          <textarea
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Cons:</label>
          <textarea
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {reviewToEdit ? "Update Review" : "Submit Review"}
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginLeft: "10px"
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

// Prop validation for ReviewForm
ReviewForm.propTypes = {
  onAddReview: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  reviewToEdit: PropTypes.object,
};

export default OneEyedReview;