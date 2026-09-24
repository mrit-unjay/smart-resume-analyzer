/*require("dotenv").config();

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeWithLLM(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Analyze this resume and give:

1. Overall score out of 100
2. Missing skills
3. Suggestions for improvement
4. Strengths
5. ATS compatibility feedback

Resume:

${text}`,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    throw error;
  }
}

module.exports = { analyzeWithLLM };/*const axios = require("axios");
const { MODE } = require("../config/aiMode");

// 🔥 PRO MODE (OpenAI)
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeWithLLM(text) {
  if (MODE === "pro") {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Analyze this resume and give score, missing skills, suggestions:\n${text}`,
        },
      ],
    });

    return response.choices[0].message.content;
  }

  // 🆓 FREE MODE (Ollama)
  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "mistral",
    prompt: `Analyze this resume and give score, missing skills, suggestions:\n${text}`,
    stream: false,
  });

  return res.data.response;
}

module.exports = { analyzeWithLLM };*/
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Analyze resume text using Gemini.
 *
 * @param {string} text - Extracted resume text
 * @param {string|null} jobDescription - Optional job description
 * @returns {Object} Structured resume analysis
 */
async function analyzeWithLLM(text, jobDescription = null) {
  try {
    console.log("🧠 Running Gemini text resume analysis...");

    if (!text || text.trim().length < 50) {
      throw new Error("Resume text is too short for analysis");
    }

    const jobContext = jobDescription
      ? `
JOB DESCRIPTION:

${jobDescription}

Compare the resume against this job description.
Identify missing skills and keywords relevant to this specific role.
`
      : `
No job description was provided.

Evaluate the resume based on general ATS and software/technology
job application standards.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",

      contents: `
You are an expert ATS resume analyzer and career assistant.

Analyze the following resume carefully.

${jobContext}

RESUME:

${text}

Evaluate:

1. Overall resume quality
2. ATS compatibility
3. Technical skills
4. Missing skills
5. Important keywords
6. Strengths
7. Weaknesses
8. Suggestions for improvement
9. Experience/project quality
10. Education section
11. Resume relevance to the job description if provided

Give scores from 0 to 100.

Return ONLY valid JSON using exactly this structure:

{
  "overallScore": 0,
  "atsTextScore": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "technicalSkills": [],
  "missingSkills": [],
  "keywords": [],
  "suggestions": [],
  "jobMatch": "",
  "experienceFeedback": "",
  "projectFeedback": "",
  "educationFeedback": ""
}

Rules:

- Scores must be numbers from 0 to 100.
- Do not invent skills or experience.
- Only identify skills that are actually present in the resume.
- Missing skills should be relevant to the job description when one is provided.
- Keep suggestions practical and specific.
- Return ONLY JSON.
      `,
    });

    const rawText = response.text.trim();

    console.log("✅ Gemini text analysis completed.");

    const cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    try {
      const result = JSON.parse(cleanedText);

      // Ensure scores exist
      result.overallScore =
        typeof result.overallScore === "number"
          ? result.overallScore
          : null;

      result.atsTextScore =
        typeof result.atsTextScore === "number"
          ? result.atsTextScore
          : null;

      return result;
    } catch (parseError) {
      console.warn("⚠️ Gemini returned invalid JSON for LLM analysis.");

      return {
        overallScore: null,
        atsTextScore: null,
        summary: rawText,
        strengths: [],
        weaknesses: [],
        technicalSkills: [],
        missingSkills: [],
        keywords: [],
        suggestions: [],
        jobMatch: "",
        experienceFeedback: "",
        projectFeedback: "",
        educationFeedback: "",
      };
    }
  } catch (error) {
    console.error("❌ Gemini LLM Error:", error.message);
    throw error;
  }
}

/**
 * Tailor resume according to a job description.
 *
 * @param {string} resumeText
 * @param {string} jobDescription
 * @returns {Object}
 */
async function tailorResume(resumeText, jobDescription) {
  try {
    console.log("✍️ Running Gemini resume tailoring...");

    if (!resumeText || resumeText.length < 100) {
      throw new Error("Resume text is too short");
    }

    if (!jobDescription || jobDescription.length < 20) {
      throw new Error("Job description is too short");
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",

      contents: `
You are an expert resume optimization assistant.

Tailor the following resume for the provided job description.

IMPORTANT:
- Do NOT invent experience.
- Do NOT invent projects.
- Do NOT invent qualifications.
- Do NOT claim the candidate has skills they do not have.
- Improve wording and keyword alignment using information already present.
- Keep the resume professional and ATS-friendly.

RESUME:

${resumeText}

JOB DESCRIPTION:

${jobDescription}

Return ONLY valid JSON:

{
  "summary": "",
  "recommendedChanges": [],
  "matchedKeywords": [],
  "missingKeywords": [],
  "rewrittenSummary": "",
  "rewrittenSkills": [],
  "projectSuggestions": [],
  "experienceSuggestions": []
}
      `,
    });

    const rawText = response.text.trim();

    const cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      return {
        summary: rawText,
        recommendedChanges: [],
        matchedKeywords: [],
        missingKeywords: [],
        rewrittenSummary: "",
        rewrittenSkills: [],
        projectSuggestions: [],
        experienceSuggestions: [],
      };
    }
  } catch (error) {
    console.error("❌ Gemini Tailoring Error:", error.message);
    throw error;
  }
}

module.exports = {
  analyzeWithLLM,
  tailorResume,
};