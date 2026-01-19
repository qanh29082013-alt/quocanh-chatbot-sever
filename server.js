import express from "express";
import fs from "fs";
import bcrypt from "bcrypt";
import session from "express-session";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "chatgpt-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// helpers
const load = (file) =>
  fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];

const save = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

// auth
app.post("/register", async (req, res) => {
  const { user, pass } = req.body;
  const users = load("users.json");

  if (users.find((u) => u.user === user))
    return res.send("User exists");

  const hash = await bcrypt.hash(pass, 10);
  users.push({ user, pass: hash });
  save("users.json", users);

  res.redirect("/");
});

app.post("/login", async (req, res) => {
  const { user, pass } = req.body;
  const users = load("users.json");
  const u = users.find((x) => x.user === user);

  if (!u || !(await bcrypt.compare(pass, u.pass)))
    return res.send("Sai thông tin");

  req.session.user = user;
  res.redirect("/chat.html");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// chat
app.post("/chat", async (req, res) => {
  if (!req.session.user) return res.sendStatus(401);

  const body = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: req.body.message }],
  };

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await r.json();
  const reply = data.choices[0].message.content;

  const chats = load("chats.json");
  chats.push({ user: req.session.user, msg: req.body.message, reply });
  save("chats.json", chats);

  res.json({ reply });
});

app.get("/history", (req, res) => {
  if (!req.session.user) return res.json([]);
  const chats = load("chats.json").filter(
    (c) => c.user === req.session.user
  );
  res.json(chats);
});

app.listen(PORT, () =>
  console.log("Server running on port " + PORT)
);
