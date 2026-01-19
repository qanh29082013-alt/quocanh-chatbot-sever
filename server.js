import express from "express";
import session from "express-session";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// test route
app.get("/", (req, res) => {
  res.send("✅ Server is running on Render!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
