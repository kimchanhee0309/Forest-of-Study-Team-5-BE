import express from "express";
import { createStudy } from "../controllers/studyController.js";
import { validateStudyCreate } from "../validators/studyValidator.js";

const router = express.Router();

// POST /api/studies - 스터디 생성
router.post("/", validateStudyCreate, createStudy);

export { router as studyRouter };
