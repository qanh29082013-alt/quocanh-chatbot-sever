// ==========================
// IMPORT
// ==========================
const express = require("express");
const cors = require("cors");

const app = express();

// ==========================
// MIDDLEWARE
// ==========================
app.use(cors());
app.use(express.json());

// ==========================
// ROUTE TEST (QUAN TRỌNG)
// ==========================
app.get("/", (req, res) => {
  res.send("✅ Server is running successfully!");
});

// ==========================
// API CHAT (demo – sau này gắn API GPT/Gemini)
// ==========================
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  // demo trả lời
  res.json({
    reply: `🤖 Bot nhận được: ${message}`,
  });
});

// ==========================
// START SERVER (LUÔN CUỐI FILE)
// ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
