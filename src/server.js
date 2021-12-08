import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();

const logger = morgan("dev");

const home = (req, res) => {
  return res.send("<h1>Welcome to Home Page!</h1>");
};

app.use(logger);

app.get("/", home);

const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
