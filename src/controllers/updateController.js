import { z } from "zod";
import prisma from "../configs/prisma.js";
import { HttpError } from "../utils/errors.js";

const updateStudyParamsSchema = z.object({
  studyId: z.coerce.number().int().positive(),
});

const updateStudyBodySchema = z.object({
  nickname: z.string().trim().min(1, "닉네임을 입력해주세요").max(30),
  title: z.string().trim().min(1, "스터디 이름을 입력해주세요").max(50),
  description: z.string().trim().max(200).optional(),
  background: z.string().trim().min(1, "배경을 선택해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export const updateStudy = async (req, res) => {
  const { studyId } = updateStudyParamsSchema.parse(req.params);
  const { nickname, title, description, background, password } =
    updateStudyBodySchema.parse(req.body);

  const study = await prisma.study.findUnique({
    where: { id: studyID },
  });

  if (!study || study.isDeleted) {
    throw new HttpError(404, "스터디를 찾을 수 없습니다.");
  }

  if (study.password !== password) {
    throw new HttpError(401, "비밀번호가 일치하지 않습니다.");
  }

  const updateStudy = await prisma.study.update({
    where: { id: studyId },
    data: {
      nickname,
      title,
      description,
      background,
    },
    select: {
      id: true,
      nickname: true,
      title: true,
      description: true,
      background: true,
      totalPoint: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({
    success: true,
    message: "스터디가 수정되었습니다.",
    data: updatedStudy,
  });
};
