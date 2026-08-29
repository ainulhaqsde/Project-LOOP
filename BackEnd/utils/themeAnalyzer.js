const themeKeywords = {
  performance: [
    "slow",
    "speed",
    "loading",
    "load",
    "lag",
    "performance",
    "freeze",
    "freezing",
  ],

  usability: [
    "difficult",
    "confusing",
    "complicated",
    "easy",
    "simple",
    "interface",
    "navigation",
    "usability",
    "user friendly",
  ],

  pricing: [
    "price",
    "pricing",
    "cost",
    "expensive",
    "cheap",
    "subscription",
    "payment",
    "plan",
  ],

  support: [
    "support",
    "help",
    "customer service",
    "response",
    "agent",
    "ticket",
  ],

  features: [
    "feature",
    "features",
    "function",
    "functionality",
    "option",
    "tool",
  ],

  bugs: [
    "bug",
    "bugs",
    "error",
    "errors",
    "crash",
    "broken",
    "issue",
    "issues",
  ],
};

const analyzeThemes = (message) => {
  if (!message || typeof message !== "string") {
    return [];
  }

  const text = message.toLowerCase();

  const detectedThemes = [];

  Object.entries(themeKeywords).forEach(
    ([theme, keywords]) => {
      const found = keywords.some((keyword) =>
        text.includes(keyword)
      );

      if (found) {
        detectedThemes.push(theme);
      }
    }
  );

  return detectedThemes;
};

module.exports = analyzeThemes;