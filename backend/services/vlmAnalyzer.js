const axios = require("axios");
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

module.exports = { analyzeWithVLM };