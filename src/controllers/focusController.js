// focusController.js — 오늘의 집중 컨트롤러 + 서비스 로직 통합
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// 포인트 계산
// 기본 3점 + 설정한 공부시간 10분당 1점
// 예) 25분 설정 → 3 + floor(25/10) = 3 + 2 = 5점
//     60분 설정 → 3 + floor(60/10) = 3 + 6 = 9점
// ============================================================
function calcPoint(targetMinutes) {
  return 3 + Math.floor(targetMinutes / 10);
}

// ============================================================
// B-1. POST /api/studies/:id/verify
// 비밀번호 검증
// ============================================================
export async function verifyStudy(req, res) {
  const id = Number(req.params.id);
  const { password } = req.body;

  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "비밀번호를 입력해 주세요." });
  }

  const study = await prisma.study.findFirst({
    where: { id, isDeleted: false },
    select: { password: true },
  });

  if (!study) {
    return res
      .status(404)
      .json({ success: false, message: "스터디를 찾을 수 없습니다." });
  }

  if (study.password !== password) {
    return res
      .status(401)
      .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
  }

  return res
    .status(200)
    .json({ success: true, message: "비밀번호가 일치합니다." });
}

// ============================================================
// B-2. GET /api/focus/:studyId/current
// 현재 집중 현황 조회 (진행 중인 세션 + 누적 포인트)
// ============================================================
export async function getCurrentFocus(req, res) {
  const studyId = Number(req.params.studyId);

  const study = await prisma.study.findUnique({
    where: { id: studyId },
    select: { totalPoint: true },
  });

  if (!study) {
    return res
      .status(404)
      .json({ success: false, message: "스터디를 찾을 수 없습니다." });
  }

  const session = await prisma.focusSession.findFirst({
    where: {
      studyId,
      status: { in: ["ongoing", "paused"] },
    },
    orderBy: { startedAt: "desc" },
  });

  return res.status(200).json({
    success: true,
    data: {
      session: session || null,
      total_point: study.totalPoint,
    },
  });
}

// ============================================================
// B-3. POST /api/focus/:studyId
// 집중 시작
// ============================================================
export async function startFocus(req, res) {
  const studyId = Number(req.params.studyId);
  const { targetMinutes } = req.body;

  if (!targetMinutes) {
    return res
      .status(400)
      .json({ success: false, message: "targetMinutes는 필수입니다." });
  }

  const ongoing = await prisma.focusSession.findFirst({
    where: {
      studyId,
      status: { in: ["ongoing", "paused"] },
    },
  });

  if (ongoing) {
    return res
      .status(409)
      .json({
        success: false,
        message: "이미 진행 중인 집중 세션이 있습니다.",
      });
  }

  const session = await prisma.focusSession.create({
    data: {
      studyId,
      targetMinutes: Number(targetMinutes),
      status: "ongoing",
    },
  });

  return res.status(201).json({ success: true, data: session });
}

// ============================================================
// B-4. PATCH /api/focus/:id/pause
// 일시정지
// ============================================================
export async function pauseFocus(req, res) {
  const id = Number(req.params.id);
  const { elapsed_seconds } = req.body;

  const session = await prisma.focusSession.findUnique({ where: { id } });

  if (!session) {
    return res
      .status(404)
      .json({ success: false, message: "세션을 찾을 수 없습니다." });
  }

  if (session.status !== "ongoing") {
    return res
      .status(400)
      .json({
        success: false,
        message: "진행 중인 세션만 일시정지할 수 있습니다.",
      });
  }

  const prevDuration = session.durationSeconds || 0;

  const updated = await prisma.focusSession.update({
    where: { id },
    data: {
      status: "paused",
      durationSeconds: prevDuration + Number(elapsed_seconds),
    },
  });

  return res.status(200).json({ success: true, data: updated });
}

// ============================================================
// B-5. PATCH /api/focus/:id/resume
// 재개
// ============================================================
export async function resumeFocus(req, res) {
  const id = Number(req.params.id);

  const session = await prisma.focusSession.findUnique({ where: { id } });

  if (!session) {
    return res
      .status(404)
      .json({ success: false, message: "세션을 찾을 수 없습니다." });
  }

  if (session.status !== "paused") {
    return res
      .status(400)
      .json({
        success: false,
        message: "일시정지된 세션만 재개할 수 있습니다.",
      });
  }

  const updated = await prisma.focusSession.update({
    where: { id },
    data: { status: "ongoing" },
  });

  return res.status(200).json({ success: true, data: updated });
}

// ============================================================
// B-6. PATCH /api/focus/:id/complete
// 집중 완료 + 포인트 계산
// ============================================================
export async function completeFocus(req, res) {
  const id = Number(req.params.id);

  const session = await prisma.focusSession.findUnique({ where: { id } });

  if (!session) {
    return res
      .status(404)
      .json({ success: false, message: "세션을 찾을 수 없습니다." });
  }

  if (session.status === "completed") {
    return res
      .status(400)
      .json({ success: false, message: "이미 완료된 세션입니다." });
  }

  const earned_point = calcPoint(session.targetMinutes);

  const [updatedSession] = await prisma.$transaction([
    prisma.focusSession.update({
      where: { id },
      data: {
        status: "completed",
        endedAt: new Date(),
        earnedPoint: earned_point,
      },
    }),
    prisma.study.update({
      where: { id: session.studyId },
      data: { totalPoint: { increment: earned_point } },
    }),
  ]);

  return res.status(200).json({
    success: true,
    message: `집중 완료되어 ${earned_point}포인트가 지급되었습니다.`,
    data: {
      session: updatedSession,
      earned_point,
    },
  });
}
