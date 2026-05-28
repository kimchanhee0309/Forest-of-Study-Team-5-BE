import express from "express";
import dotenv from "dotenv";
import { focusRouter } from "./controllers/focusController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Todo API Server" });
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

app.use("/api/focus", focusRouter);
