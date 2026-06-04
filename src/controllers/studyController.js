import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/ studies
// 스터디 생성

export async function createStudy(req, res) {
  const { nickname, title, description, background, password } = req.body;

  try {
    const study = await prisma.study.create({
      data: {
        nickname,
        title,
        description,
        background: background || "green", // 기본값 green
        password,
      },
    });

    return res.status(201).json({
      success: true,
      message: "스터디가 생성되었습니다.",
      data: study,
    });
  } catch (error) {
    console.error("스터디 생성 오류:", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
}
