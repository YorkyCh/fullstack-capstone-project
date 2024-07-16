const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../models/db');

// Search for gifts
router.get('/', async (req, res, next) => {
    try {
        // Task 1: Connect to MongoDB using connectToDatabase database.
        const db = await connectToDatabase();

        const collection = db.collection("gifts");

        // Initialize the query object
        let query = {};

        // Add the name filter to the query if the name parameter is not empty
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: "i" }; // Using regex for partial match, case-insensitive
        }

        // Add other filters to the query
        if (req.query.category) {
            query.category = req.query.category; // Assuming category is a direct match
        }
        if (req.query.condition) {
            query.condition = req.query.condition; // Assuming condition is a direct match
        }
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) }; // Age less than or equal to the specified value
        }

        // Task 4: Fetch filtered gifts using the find(query) method
        const gifts = await collection.find(query).toArray();

        res.json(gifts);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
