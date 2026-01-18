import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "DAN_API_KEY_GEMINI";

app.post("/chat", async (req, res) => {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        contents: [{ parts: [{ text: req.body.prompt }] }]
      })
    }
  );

  const d = await r.json();
  res.json({
    reply: d.candidates[0].content.parts[0].text
  });
});

app.listen(3000, () =>
  console.log("✅ Server chạy http://localhost:3000")
);
