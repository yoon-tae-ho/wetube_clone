import express from "express";

const PORT = 4000;

const app = express();

app.get("/", (req, res) => {
  console.log(req.url);
  console.log(req.method);
  res.send("Hey hey im here!");
});

app.get("/login", (req, res) => {
  res.send("login here!");
});

const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
