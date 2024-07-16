const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const connectToDatabase = require("../models/db");
const router = express.Router();
const dotenv = require("dotenv");
const pino = require("pino"); // Import Pino logger

// Step 1 - Task 3: Create a Pino logger instance
const logger = pino();

// Step 1 - Task 4: Create JWT secret
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post(
  "/register",
  [
    // Validate input
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      // Connect to the database
      const db = await connectToDatabase();
      const usersCollection = db.collection("users");

      // Check if the user already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcryptjs.hash(password, 10);

      // Create the user object
      const newUser = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      };

      // Insert the new user into the database
      const result = await usersCollection.insertOne(newUser);

      // Generate JWT token
      const token = jwt.sign(
        { userId: result.insertedId, email: newUser.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Respond with the token
      res.status(201).json({ token });
    } catch (error) {
      logger.error("Error registering user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
