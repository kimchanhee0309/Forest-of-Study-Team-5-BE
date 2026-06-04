import express from "express";
import { getStudies } from "../controllers/studies.js";

const router = express.Router();

router.get("/studies", getStudies);

export default router;
