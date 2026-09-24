/*const axios = require("axios");
const fs = require("fs");
const { MODE } = require("../config/aiMode");

// PRO MODE
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeWithVLM(filePath) {
  if (MODE === "pro") {
    const imageBase64 = fs.readFileSync(filePath, "base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze resume layout and formatting" },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
    });

    return response.choices[0].message.content;
  }

  // 🆓 FREE MODE (Ollama VLM)
  const imageBase64 = fs.readFileSync(filePath, "base64");

  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "llava",
    prompt: "Analyze resume layout and formatting",
    images: [imageBase64],
    stream: false,
  });

  return res.data.response;
}

module.exports = { analyzeWithVLM };*/
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Analyze resume visually using Gemini.
 *
 * @param {Buffer} fileBuffer - Uploaded resume buffer
 * @param {string} mimetype - File MIME type
 * @returns {Object} Structured visual analysis
 */
async function analyzeWithVLM(fileBuffer, mimetype) {
  try {
    console.log("🔍 Running Gemini visual resume analysis...");

    if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
      throw new Error("Invalid resume buffer provided to VLM");
    }

    let mimeType = mimetype;

    // Normalize MIME type
    if (mimeType === "application/octet-stream") {
      mimeType = "application/pdf";
    }

    const supportedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!supportedTypes.includes(mimeType)) {
      throw new Error(`Unsupported visual file type: ${mimeType}`);
    }

    // Convert uploaded buffer to Base64
    const base64Data = fileBuffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",

      contents: [
        {
          text: `
You are an expert resume visual and ATS formatting analyzer.

Analyze this resume ONLY from a visual, layout, formatting, readability,
and ATS-compatibility perspective.

Evaluate:

1. Overall visual quality
2. Resume layout and structure
3. Section organization
4. Readability
5. Font consistency
6. Spacing and alignment
7. Heading consistency
8. Bullet point formatting
9. Color usage
10. ATS-friendly formatting
11. Whether important information is easy to find
12. Visual/layout problems
13. Specific improvements

Give a layout score from 0 to 100.

Do NOT judge the candidate's technical qualifications.
Do NOT invent information that is not visible in the resume.

Return ONLY valid JSON in this exact structure:

{
  "layoutScore": 0,
  "strengths": [],
  "issues": [],
  "suggestions": [],
  "atsLayoutFeedback": "",
  "summary": ""
}
          `,
        },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
      ],
    });

    const rawText = response.text.trim();

    console.log("✅ Gemini visual analysis completed.");

    // Remove Markdown code fences if Gemini adds them
    const cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    try {
      const result = JSON.parse(cleanedText);

      // Make sure layoutScore is a number
      if (typeof result.layoutScore !== "number") {
        result.layoutScore = null;
      }

      return result;
    } catch (parseError) {
      console.warn("⚠️ Gemini returned invalid JSON for VLM analysis.");

      return {
        layoutScore: null,
        strengths: [],
        issues: [],
        suggestions: [],
        atsLayoutFeedback: "",
        summary: rawText,
      };
    }
  } catch (error) {
    console.error("❌ Gemini VLM Error:", error.message);
    throw error;
  }
}

module.exports = {
  analyzeWithVLM,
};