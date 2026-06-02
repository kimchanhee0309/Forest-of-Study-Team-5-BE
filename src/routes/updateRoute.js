import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateStudy } from "../controllers/updateController.js";

export const updateRouter = express.Router();

updateRouter.patch("/:studyId", asyncHandler(updateStudy));
