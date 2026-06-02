import express from "express";
import { getStudies } from "../controllers/studies";

const router = express.Router();

router.get("/studis", getStudies);

export default router;
