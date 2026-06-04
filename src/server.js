import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import focusRouter from "./routes/focusRoute.js";
import { studyRouter } from "./routes/studyRoute.js";
import { updateRouter } from "./routes/updateRoute.js";
import studyEmojiRouter from "./routes/emojiRoute.js";
import studyDetailRouter from "./routes/studyDetailRoute.js";
import habitRouter from "./routes/habitRoute.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
   res.json({ message: "Todo API Server" });
});

app.use(studyDetailRouter);
app.use(studyEmojiRouter);

app.use("/api/focus", focusRouter);
app.use("/api/studies", studyRouter);
app.use("/api", habitRouter);

app.listen(PORT, () => {
   console.log(`Server running on port: ${PORT}`);
});
app.use("/api/studies", updateRouter);
