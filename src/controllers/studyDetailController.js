import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getStudyDetail = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);

    const study = await prisma.study.findUnique({
      where: {
        id: studyId,
      },

      include: {
        habits: {
          include: {
            habitLogs: {
              orderBy: {
                checkedDate: "asc",
              },
            },
          },
        },
      },
    });

    if (!study) {
      return res.status(404).json({
        message: "스터디를 찾을 수 없습니다.",
      });
    }

    return res.status(200).json(study);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "서버 오류",
    });
  }
};
