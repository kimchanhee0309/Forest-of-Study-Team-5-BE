// focusRoute.js — 오늘의 집중 라우터
// 경로 등록만 담당, 비즈니스 로직은 컨트롤러/서비스에서 처리
import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  verifyStudy,
  getCurrentFocus,
  startFocus,
  pauseFocus,
  resumeFocus,
  completeFocus,
} from "../controllers/focusController.js";

const router = express.Router();

// B-1. POST /api/studies/:id/verify      — 비밀번호 검증
router.post("/studies/:id/verify", asyncHandler(verifyStudy));

// B-2. GET  /api/focus/:studyId/current  — 현재 진행 중인 세션 + 누적 포인트 조회
router.get("/:studyId/current", asyncHandler(getCurrentFocus));

// B-3. POST /api/focus/:studyId          — 집중 시작
router.post("/:studyId", asyncHandler(startFocus));

// B-4. PATCH /api/focus/:id/pause        — 일시정지
router.patch("/:id/pause", asyncHandler(pauseFocus));

// B-5. PATCH /api/focus/:id/resume       — 재개
router.patch("/:id/resume", asyncHandler(resumeFocus));

// B-6. PATCH /api/focus/:id/complete     — 집중 완료
router.patch("/:id/complete", asyncHandler(completeFocus));

export default router;
