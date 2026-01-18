const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

/* =====================
   MIDDLEWARE
===================== */
app.use(cors());
app.use(express.json());

/* =====================
   TEST ROUTE (BẮT BUỘC)
===================== */
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

/* =====================
   API CHAT (GEMINI)
===================== */
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Bot không trả lời được";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================
   START SERVER (RENDER)
===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});
