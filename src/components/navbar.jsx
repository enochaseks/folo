import React from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav style={{ backgroundColor: "red", padding: "10px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "1.5rem" }}>
        Home
      </Link>
      <input
        type="text"
        placeholder="Search services..."
        style={{ padding: "5px", borderRadius: "5px", border: "none" }}
      />
      <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
        <FaUser size={24} />
      </Link>
    </nav>
  );
};

export default Navbar;