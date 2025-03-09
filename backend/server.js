const express = require("express");
const router = express.Router();
const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Load environment variables
dotenv.config();

// Create an Express app
const app = express();



// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME || "folo-app", // Database name
  process.env.DB_USER || "postgres", // Database user
  process.env.DB_PASSWORD || "Horsedancing123", // Database password
  {
    host: process.env.DB_HOST || "localhost", // Database host
    dialect: "postgres", // Database dialect
  }
);

// Define the User model
const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("buyer", "seller"),
    defaultValue: "buyer",
  },
});

// Sync the model with the database
sequelize
  .sync()
  .then(() => {
    console.log("Database & tables synced!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

  const nodemailer = require("nodemailer");

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/api/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      verified: false, // User is not verified yet
    });

    // Send verification email
    const verificationLink = `http://localhost:5000/api/verify?token=${jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `Click <a href="${verificationLink}">here</a> to verify your email.`,
    });

    res.status(201).json({ message: "User created successfully. Please check your email to verify your account.", user });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/verify", async (req, res) => {
    const { token } = req.query;
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Find the user
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(400).json({ message: "Invalid token" });
      }
  
      // Mark the user as verified
      user.verified = true;
      await user.save();
  
      res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
      console.error("Error verifying email:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Generate a reset token
      const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      // Save the reset token and expiry in the database
      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
      await user.save();
  
      // Send reset password email
      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
  
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Your Password",
        html: `Click <a href="${resetLink}">here</a> to reset your password.`,
      });
  
      res.status(200).json({ message: "Password reset email sent" });
    } catch (err) {
      console.error("Error sending reset email:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post("/api/reset-password", async (req, res) => {
    const { token, password } = req.body;
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Find the user
      const user = await User.findOne({
        where: {
          id: decoded.id,
          resetToken: token,
          resetTokenExpiry: { [Op.gt]: Date.now() }, // Check if the token is still valid
        },
      });
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Update the user's password and clear the reset token
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();
  
      res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
      console.error("Error resetting password:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

// Signup route
app.post("/api/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log("Request body:", req.body);

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "5576b95c0e5573970580128eb42bc8dc9ae8e2f848ebd825f177d358444b86e8", {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = router;