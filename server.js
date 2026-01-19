import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

// fix __dirname cho ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "quocanh-secret",
    resave: false,
    saveUninitialized: true,
  })
);

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "123456") {
    req.session.user = username;
    return res.json({ success: true });
  }

  res.json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
});

// check login
app.get("/me", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
