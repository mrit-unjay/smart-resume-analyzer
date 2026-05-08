const axios = require("axios");
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

module.exports = { analyzeWithLLM };