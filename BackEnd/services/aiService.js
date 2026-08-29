import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI, Type } from "@google/genai";

// =====================================================
// CHECK GEMINI API KEY
// =====================================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing. Check your BackEnd/.env file."
  );
}

console.log("Gemini API key loaded successfully.");


// =====================================================
// GEMINI CLIENT
// =====================================================

const ai = new GoogleGenAI({
  apiKey,
});


// =====================================================
// FEEDBACK ANALYSIS SCHEMA
// =====================================================

const feedbackAnalysisSchema = {
  type: Type.OBJECT,

  properties: {
    sentiment: {
      type: Type.STRING,
      enum: [
        "positive",
        "negative",
        "neutral",
      ],
    },

    themes: {
      type: Type.ARRAY,

      items: {
        type: Type.STRING,
      },
    },

    summary: {
      type: Type.STRING,
    },

    keyIssue: {
      type: Type.STRING,
    },

    recommendation: {
      type: Type.STRING,
    },
  },

  required: [
    "sentiment",
    "themes",
    "summary",
    "keyIssue",
    "recommendation",
  ],
};


// =====================================================
// ANALYZE CUSTOMER FEEDBACK
// =====================================================

const analyzeFeedbackWithAI = async (message) => {
  try {

    // =================================================
    // VALIDATE MESSAGE
    // =================================================

    if (!message || typeof message !== "string") {
      throw new Error(
        "Feedback message is required."
      );
    }

    const cleanMessage = message.trim();

    if (!cleanMessage) {
      throw new Error(
        "Feedback message cannot be empty."
      );
    }


    console.log(
      "Sending feedback to Gemini..."
    );

    console.log(
      "Feedback:",
      cleanMessage
    );


    // =================================================
    // PROMPT
    // =================================================

    const prompt = `
You are an AI customer feedback analyst for Project LOOP.

Analyze the following customer feedback:

"${cleanMessage}"

Identify:

1. Customer sentiment
2. Important themes
3. A short summary
4. The main issue or important positive point
5. A practical recommendation

Rules:

1. sentiment must be exactly one of:
   - positive
   - negative
   - neutral

2. themes must always be an array of strings.

3. summary must be short and clear.

4. keyIssue must identify the main complaint,
   issue, or important positive point.

5. recommendation must provide a practical
   action that a business could take.

6. If the feedback is random, meaningless,
   unclear, or too short to analyze:

   - sentiment = neutral
   - themes should indicate unclear or invalid feedback
   - summary should explain that the feedback is unclear
   - keyIssue should indicate insufficient information
   - recommendation should request clearer feedback.

7. Do not invent information that is not present
   in the customer's feedback.

Return only the requested structured JSON response.
`;


    // =================================================
    // GEMINI REQUEST WITH RETRY
    // =================================================

    const MAX_RETRIES = 3;

    let response = null;

    for (
      let attempt = 1;
      attempt <= MAX_RETRIES;
      attempt++
    ) {

      try {

        console.log(
          `Gemini request attempt ${attempt}/${MAX_RETRIES}...`
        );

        response = await ai.models.generateContent({

          model: "gemini-3.6-flash",

          contents: prompt,

          config: {
            responseMimeType: "application/json",

            responseSchema:
              feedbackAnalysisSchema,
          },

        });

        console.log(
          "Gemini response received."
        );

        break;

      } catch (error) {

        const errorMessage =
          error?.message || "";

        console.error(
          `Gemini attempt ${attempt} failed:`
        );

        console.error(
          errorMessage
        );


        const isTemporaryError =
          errorMessage.includes("503") ||
          errorMessage.includes("UNAVAILABLE") ||
          errorMessage.includes("overloaded") ||
          errorMessage.includes("429") ||
          errorMessage.includes(
            "RESOURCE_EXHAUSTED"
          );


        if (!isTemporaryError) {
          throw error;
        }


        if (attempt === MAX_RETRIES) {
          throw new Error(
            "Gemini AI is temporarily unavailable. Please try again in a moment."
          );
        }


        const delay =
          1000 * Math.pow(
            2,
            attempt - 1
          );


        console.log(
          `Retrying Gemini in ${delay}ms...`
        );


        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              delay
            )
        );
      }
    }


    // =================================================
    // VALIDATE RESPONSE
    // =================================================

    if (!response) {
      throw new Error(
        "Gemini did not return a response."
      );
    }


    const responseText =
      response.text;


    if (!responseText) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }


    // =================================================
    // PARSE JSON
    // =================================================

    let analysis;

    try {

      analysis =
        JSON.parse(responseText);

    } catch (error) {

      console.error(
        "Gemini returned invalid JSON:"
      );

      console.error(
        responseText
      );

      throw new Error(
        "Gemini returned invalid JSON."
      );
    }


    // =================================================
    // VALIDATE SENTIMENT
    // =================================================

    const allowedSentiments = [
      "positive",
      "negative",
      "neutral",
    ];


    const sentiment =
      allowedSentiments.includes(
        analysis.sentiment
      )
        ? analysis.sentiment
        : "neutral";


    // =================================================
    // CLEAN THEMES
    // =================================================

    const themes =
      Array.isArray(
        analysis.themes
      )
        ? analysis.themes
            .filter(
              (theme) =>
                typeof theme === "string"
            )
            .map(
              (theme) =>
                theme.trim()
            )
            .filter(Boolean)
        : [];


    // =================================================
    // CLEAN RESULT
    // =================================================

    const result = {

      sentiment,

      themes,

      summary:
        typeof analysis.summary === "string"
          ? analysis.summary.trim()
          : "",

      keyIssue:
        typeof analysis.keyIssue === "string"
          ? analysis.keyIssue.trim()
          : "",

      recommendation:
        typeof analysis.recommendation === "string"
          ? analysis.recommendation.trim()
          : "",

    };


    console.log(
      "AI analysis completed successfully."
    );

    console.log(
      "AI Analysis:",
      result
    );


    return result;

  } catch (error) {

    console.error(
      "========== GEMINI ERROR =========="
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Full Error:",
      error
    );

    console.error(
      "=================================="
    );

    throw error;
  }
};


// =====================================================
// ASK AI ABOUT CUSTOMER FEEDBACK
// =====================================================

const askFeedbackAI = async (
  question,
  feedbacks
) => {

  try {

    // =================================================
    // VALIDATE QUESTION
    // =================================================

    if (
      !question ||
      typeof question !== "string"
    ) {
      throw new Error(
        "AI question is required."
      );
    }


    const cleanQuestion =
      question.trim();


    if (!cleanQuestion) {
      throw new Error(
        "AI question cannot be empty."
      );
    }


    // =================================================
    // VALIDATE FEEDBACK DATA
    // =================================================

    if (!Array.isArray(feedbacks)) {
      throw new Error(
        "Feedback data must be an array."
      );
    }


    // =================================================
    // PREPARE FEEDBACK DATA
    // =================================================

    const feedbackData =
      feedbacks.map(
        (feedback, index) => ({

          id: index + 1,

          customerName:
            feedback.customerName ||
            "Unknown",

          source:
            feedback.source ||
            "Unknown",

          message:
            feedback.message ||
            "",

          sentiment:
            feedback.sentiment ||
            "neutral",

          themes:
            Array.isArray(
              feedback.themes
            )
              ? feedback.themes
              : [],

          summary:
            feedback.summary ||
            "",

          keyIssue:
            feedback.keyIssue ||
            "",

          recommendation:
            feedback.recommendation ||
            "",

        })
      );


    // =================================================
    // CONVERT FEEDBACK TO JSON
    // =================================================

    const feedbackJSON =
      JSON.stringify(
        feedbackData,
        null,
        2
      );


    // =================================================
    // PROMPT
    // =================================================

    const prompt = `
You are the AI business intelligence assistant for Project LOOP.

You help businesses understand their customer feedback.

The following customer feedback data is available:

${feedbackJSON}

The user has asked:

"${cleanQuestion}"

Answer the user's question using ONLY the customer feedback data provided above.

IMPORTANT RULES:

1. Do not invent customer feedback.

2. Do not make claims that cannot be supported
   by the provided data.

3. If there is not enough information to answer
   the question, clearly say that there is not
   enough data.

4. Look for meaningful patterns across:

   - sentiment
   - themes
   - customer messages
   - summaries
   - key issues
   - recommendations

5. Give practical business-oriented insights
   whenever the available data supports them.

6. Keep the answer clear and easy to understand.

7. If the user asks for a recommendation,
   base it directly on the feedback patterns.

8. Do not mention internal IDs.

9. Do not pretend to know information outside
   the provided feedback.

Return a concise but useful answer.
`;


    // =================================================
    // GEMINI REQUEST
    // =================================================

    console.log(
      "Sending AI business question to Gemini..."
    );


    const MAX_RETRIES = 3;

    let response = null;


    for (
      let attempt = 1;
      attempt <= MAX_RETRIES;
      attempt++
    ) {

      try {

        console.log(
          `AI question attempt ${attempt}/${MAX_RETRIES}...`
        );


        response =
          await ai.models.generateContent({

            model:
              "gemini-3.6-flash",

            contents:
              prompt,

          });


        console.log(
          "AI business response received."
        );


        break;

      } catch (error) {

        const errorMessage =
          error?.message || "";


        console.error(
          `AI question attempt ${attempt} failed:`
        );

        console.error(
          errorMessage
        );


        const isTemporaryError =
          errorMessage.includes("503") ||
          errorMessage.includes("UNAVAILABLE") ||
          errorMessage.includes("overloaded") ||
          errorMessage.includes("429") ||
          errorMessage.includes(
            "RESOURCE_EXHAUSTED"
          );


        if (!isTemporaryError) {
          throw error;
        }


        if (
          attempt === MAX_RETRIES
        ) {

          throw new Error(
            "Gemini AI is temporarily unavailable. Please try again in a moment."
          );

        }


        const delay =
          1000 *
          Math.pow(
            2,
            attempt - 1
          );


        console.log(
          `Retrying AI question in ${delay}ms...`
        );


        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              delay
            )
        );
      }
    }


    // =================================================
    // VALIDATE RESPONSE
    // =================================================

    if (!response) {

      throw new Error(
        "Gemini did not return an answer."
      );

    }


    const answer =
      response.text;


    if (!answer) {

      throw new Error(
        "Gemini returned an empty answer."
      );

    }


    // =================================================
    // CLEAN ANSWER
    // =================================================

    const cleanAnswer =
      answer.trim();


    console.log(
      "AI question answered successfully."
    );


    return cleanAnswer;


  } catch (error) {

    console.error(
      "========== AI QUESTION ERROR =========="
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Full Error:",
      error
    );

    console.error(
      "========================================"
    );

    throw error;
  }
};


// =====================================================
// EXPORT
// =====================================================

export {
  analyzeFeedbackWithAI,
  askFeedbackAI,
};