const positiveWords = [
  "good",
  "great",
  "excellent",
  "amazing",
  "awesome",
  "love",
  "loved",
  "happy",
  "helpful",
  "easy",
  "best",
  "perfect",
  "fantastic",
  "wonderful",
  "satisfied",
  "useful",
  "enjoy",
  "enjoyed",
  "nice",
  "fast",
  "smooth",
  "success",
  "successful",
  "impressive",
  "recommend",
  "recommended",
];

const negativeWords = [
  "bad",
  "poor",
  "terrible",
  "horrible",
  "hate",
  "hated",
  "unhappy",
  "difficult",
  "worst",
  "awful",
  "useless",
  "slow",
  "problem",
  "problems",
  "disappointed",
  "disappointing",
  "frustrating",
  "frustrated",
  "broken",
  "failure",
  "failed",
  "error",
  "errors",
  "bug",
  "bugs",
  "issue",
  "issues",
  "expensive",
  "confusing",
];

const analyzeSentiment = (message) => {
  if (!message || typeof message !== "string") {
    return "neutral";
  }

  const words = message
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .split(/\s+/)
    .filter(Boolean);

  let positiveScore = 0;
  let negativeScore = 0;

  words.forEach((word) => {
    if (positiveWords.includes(word)) {
      positiveScore++;
    }

    if (negativeWords.includes(word)) {
      negativeScore++;
    }
  });

  if (positiveScore > negativeScore) {
    return "positive";
  }

  if (negativeScore > positiveScore) {
    return "negative";
  }

  return "neutral";
};

module.exports = analyzeSentiment;