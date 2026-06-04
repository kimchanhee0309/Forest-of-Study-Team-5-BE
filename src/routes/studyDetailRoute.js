import express from "express";
import {
  getStudyDetail,
  verifyPassword,
  deleteStudy,
} from "../controllers/studyDetailController.js";

const router = express.Router();

router.get("/studies/:studyId", getStudyDetail);
router.post("/studies/:studyId/verify-password", verifyPassword);
router.delete("/studies/:studyId", deleteStudy);

export default router;
