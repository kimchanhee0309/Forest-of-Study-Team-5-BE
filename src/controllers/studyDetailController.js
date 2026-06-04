import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 조회하기
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

// 비밀번호 인증
export const verifyPassword = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);
    const { password } = req.body;

    const study = await prisma.study.findUnique({
      where: {
        id: studyId,
      },
    });

    if (!study) {
      return res.status(404).json({
        message: "스터디를 찾을 수 없습니다.",
      });
    }

    if (study.password !== password) {
      return res.status(401).json({
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    return res.status(200).json({
      message: "비밀번호 확인 완료",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "서버 오류",
    });
  }
};

// 삭제하기
export const deleteStudy = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);

    await prisma.study.delete({
      where: {
        id: studyId,
      },
    });

    return res.status(200).json({
      message: "스터디가 삭제되었습니다.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "서버 오류",
    });
  }
};
