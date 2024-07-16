const express = require("express");
const app = express();
const natural = require("natural");
const logger = require("../logger");

const port = process.env.PORT || 3000;

app.use(express.json());

// Create a POST /sentiment endpoint
app.post("/sentiment", async (req, res) => {
  // Task 4: Extract the sentence parameter from the request body
  const { sentence } = req.body;

  if (!sentence) {
    logger.error("No sentence provided");
    return res.status(400).json({ error: "No sentence provided" });
  }

  // Initialize the sentiment analyzer with Natural's PorterStemmer and "English" language
  const Analyzer = natural.SentimentAnalyzer;
  const stemmer = natural.PorterStemmer;
  const analyzer = new Analyzer("English", stemmer, "afinn");

  // Perform sentiment analysis
  try {
    const analysisResult = analyzer.getSentiment(sentence.split(" "));

    let sentiment = "neutral";

    // Task 5: Process the response from Natural and determine sentiment
    if (analysisResult < 0) {
      sentiment = "negative";
    } else if (analysisResult > 0.33) {
      sentiment = "positive";
    }

    // Logging the result
    logger.info(`Sentiment analysis result: ${analysisResult}`);

    // Task 6: Implement success return state
    res
      .status(200)
      .json({ sentimentScore: analysisResult, sentiment: sentiment });
  } catch (error) {
    logger.error(`Error performing sentiment analysis: ${error}`);
    // Task 7: Implement error return state
    res.status(500).json({ message: "Error performing sentiment analysis" });
  }
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

module.exports = app; // Export the app for testing purposes
