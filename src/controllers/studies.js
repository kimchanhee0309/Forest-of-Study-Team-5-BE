import { PrismaClient } from "@prisma/client";
import asyncHandler from "../utils/asyncHandler.js";

const prisma = new PrismaClient();

//스터디 목록 조회

//쿼리 파라미터 받기
export const getStudies = asyncHandler(async (req, res) => {
  const { page = 1, limit = 6, keyword = "", sort = "recent" } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  //검색 조건 만들기
  const where = {
    isDeleted: false, // 삭제된 스터디는 보이지않게 제외
    ...(keyword && {
      OR: [
        { title: { contains: keyword, mode: "insensitive" } }, //제목
        { description: { contains: keyword, mode: "insensitive" } },
      ],
    }),
  };

  //정렬 조건
  const orderBy = {
    recent: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
    point_desc: { totalPoint: "desc" },
    point_asc: { totalPoint: "asc" },
  }[sort] ?? { createdAt: "desc" };

  res.status(200).json({ message: "스터디 목록 조회 성공", data: [] });
});
