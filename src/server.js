import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import focusRouter from "./routes/focusRoute.js";
import { studyRouter } from "./routes/studyRoute.js";
import { updateRouter } from "./routes/updateRoute.js";
import studyEmojiRouter from "./routes/emojiRoute.js";
import studyDetailRouter from "./routes/studyDetailRoute.js";
import habitRouter from "./routes/habitRoute.js";
import studyListRouter from "./routes/studyListRoute.js";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.get("/", (req, res) => {
  res.send("서버 작동중!!");
});

app.use(studyDetailRouter);
app.use(studyEmojiRouter);

app.use("/focus", focusRouter);
app.use("/studies", studyRouter);
app.use("/", habitRouter);
app.use("/studies", studyListRouter);
app.use("/studies", updateRouter);

app.listen(PORT, () => {
  console.log(
    `[${process.env.NODE_ENV || "development"}] Server running on port: ${PORT}`,
  );
});
