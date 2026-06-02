import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { focusRouter } from "./controllers/focusController.js";
import { studyRouter } from "./routes/studyRoute.js";
import studyEmojiRouter from "./routes/emojiRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Todo API Server" });
});

app.use(studyEmojiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

app.use("/api/focus", focusRouter);
app.use("/api/studies", studyRouter);
