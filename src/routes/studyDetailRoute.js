import express from "express";
import { getStudyDetail } from "../controllers/studyDetailController.js";

const router = express.Router();

router.get("/studies/:studyId", getStudyDetail);

export default router;
