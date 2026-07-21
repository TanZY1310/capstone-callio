const SentimentData = {
  overallSentiment: "Positive",
  intentScore: 82,
  urgency: "Medium",
  dealReadiness: {
    purchaseIntent: 82,
    purchaseUrgency: 50,
    financialReadiness: 75,
    locationAlignment: 40,
    callSentiment: 84,
  },
  scoreReasoning: {
    purchaseIntent: {
      keyQuote: "Buyer: Yes, I'm interested in a 3-bedroom unit. Brapa harga (what's the price)?",
      reasoning: "Buyer specified exact unit type and actively asked about pricing, showing clear purchase intent."
    },
    purchaseUrgency: {
      keyQuote: "Buyer: Bagus (great), can I book for Saturday?",
      reasoning: "Buyer immediately requested a specific viewing date without hesitation, indicating urgency."
    },
    financialReadiness: {
      keyQuote: "Buyer: Starting from RM650k. That sounds reasonable.",
      reasoning: "Buyer acknowledged the price point and responded positively, suggesting budget alignment."
    },
    locationAlignment: {
      keyQuote: "Buyer: Yes, I've been looking at Bukit Jalil properties.",
      reasoning: "Buyer confirmed sustained interest in the specific project location."
    },
    callSentiment: {
      keyQuote: "Buyer: Bagus (great), can I book for Saturday?",
      reasoning: "Buyer maintained an enthusiastic and cooperative tone throughout, building good rapport with agent."
    }
  },
  leadTemperature: "Hot Lead",
  emotions: [
    "Interested",
    "Budget conscious"
  ],
  objections: [
    "Concerned about maintenance fee"
  ],
  "recommendedAction": "Arrange property viewing this weekend.",
  "transcriptSummary": {
    "buyerInquiry": "Buyer called regarding 2-bedroom investment units in KLCC under RM500k cash flow.",
    "keyFrictionPoint": "First-time investor showing nervousness regarding return yields and loan eligibility.",
    "agreedOutcome": "Buyer agreed to a Saturday morning viewing if financial breakdown is sent via WhatsApp beforehand."
  }
};

export const MockPreferences = {
  preferences: "Landed or spacious condo with good accessibility",
  location: "Near Shah Alam",
  budgetValue: "RM 600,000",
  budgetNote: "Starting price acceptable, no negotiation mentioned",
  preferenceNote: "Price inquiry made, show unit viewing requested",
  signals: [
    "requested viewing",
    "specific unit type",
    "price inquiry"
  ]
};

export default SentimentData;