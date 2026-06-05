import express from "express";
import {
  addEmojiReaction,
  getStudyEmojis,
} from "../controllers/studyEmojiController.js";

const router = express.Router();

router.get("/studies/:studyId/reactions", getStudyEmojis);
router.post("/studies/:studyId/reactions", addEmojiReaction);

export default router;
