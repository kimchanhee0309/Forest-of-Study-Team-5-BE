import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// 이모지 조회
// ============================================================
export const getStudyEmojis = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);

    const emojis = await prisma.studyEmoji.findMany({
      where: {
        studyId,
      },

      orderBy: {
        count: "desc",
      },
    });

    return res.status(200).json(emojis);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "서버 오류",
    });
  }
};

// ============================================================
// 이모지 추가
// ============================================================
export const addEmojiReaction = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);
    const { emoji } = req.body;

    const result = await prisma.studyEmoji.upsert({
      // 같은 이모지가 있는지 확인
      where: {
        studyId_emoji: {
          studyId,
          emoji,
        },
      },
      // 이미 존재하면 count 증가
      update: {
        count: {
          increment: 1,
        },
      },
      // 없으면 새 생성
      create: {
        studyId,
        emoji,
        count: 1,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "서버 오류",
    });
  }
};
