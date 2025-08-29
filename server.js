// server.js 
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Initialize Google AI Client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// ✅ Normal endpoint (non-streaming, optional)
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ data: { content: "⚠️ Prompt missing" } });
  }

  try {
    const markdownPrompt = `
Format your answer in **Markdown** with:
- Headings (##, ###)
- Bullet points
- Numbered lists
- Code blocks (use \`\`\`language)

Question: ${prompt}
    `;

    const result = await model.generateContent(markdownPrompt);
    const textResponse = result.response.text();

    res.json({
      data: {
        content: textResponse,
        model: "gemini-1.5-flash-latest",
        created: Date.now(),
      },
    });
  } catch (err) {
    console.error("Backend error calling Gemini API:", err);
    res.status(500).json({ data: { content: "⚠️ Error generating text with Gemini" } });
  }
});

// ✅ Streaming endpoint
app.post("/api/chat/stream", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "⚠️ Prompt missing" });
  }

  try {
    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const markdownPrompt = `
Format your answer in **Markdown** with:
- Headings (##, ###)
- Bullet points
- Numbered lists
- Code blocks (use \`\`\`language)

Question: ${prompt}
    `;

    const result = await model.generateContentStream(markdownPrompt);

    for await (const chunk of result.stream) {
      const token = chunk.text();
      if (token) {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error("Streaming error:", err);
    res.write(`data: ${JSON.stringify({ error: "⚠️ Streaming failed" })}\n\n`);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("🤖 Now configured for Gemini Pro + Markdown + Streaming");
});
