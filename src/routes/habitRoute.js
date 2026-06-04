import express from "express";
import {
   verifyHabitPassword,
   getDailyHabits,
   createWeeklyHabitLog,
   updateHabitLogStatus,
   updateHabitName,
   endHabit,
   getWeeklyHabitLogs,
} from "../controllers/habitController.js";
import { asyncHandler } from "../utils/asyncHandler.js"; //  에러 핸들러 유틸 가져오기

const router = express.Router();

// 1. 비밀번호 검증 (POST)

// 사용자가 입력한 비밀번호가 해당 스터디 방 비밀번호랑 맞는지 체크하는 주소
router.post(
   "/studies/:studyId/verify-password",
   asyncHandler(verifyHabitPassword)
);

// 2. 당일 습관 조회 (GET)

// 오늘 날짜 기준으로 아직 종료 안 된 진행 중인 습관들만 리스트로 뽑아오는 주소
router.get("/studies/:studyId/habits", asyncHandler(getDailyHabits));

// 3. 이번주 습관 로그 생성 (POST)

// 새로운 습관 등록하면 이번 주 월요일부터 일요일까지 7일치 빈 로그까지 세트로 만들어주는 주소
router.post("/studies/:studyId/habits", asyncHandler(createWeeklyHabitLog));

// 4. 당일 습관 달성 상태 업데이트 (PATCH)

// 오늘 완료한 습관 체크박스 누르면 true나 false로 상태 수정해주는 주소
router.patch("/habits/:habitId/logs", asyncHandler(updateHabitLogStatus));

// 5. 등록된 습관 이름 수정 (PATCH)

// 이미 만들어둔 습관 이름에 오타가 있거나 수정하고 싶을 때 타이틀 바꾸는 주소
router.patch("/habits/:habitId/name", asyncHandler(updateHabitName));

// 6. 습관 종료 (PATCH)

// 스터디 도중에 특정 습관을 더 이상 안 하기로 했을 때 종료 날짜 찍어주는 주소
router.patch("/habits/:habitId/end", asyncHandler(endHabit));

// 7. 주간 달성 기록 데이터 조회 (GET)

// 이번 주 월요일부터 일요일까지 전체 습관들의 체크 현황을 한눈에 모아서 보여주는 주소
router.get("/studies/:studyId/habit-logs", asyncHandler(getWeeklyHabitLogs));

export default router;
