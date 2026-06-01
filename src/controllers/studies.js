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

  //정렬 조건
  const orderBy = {
    recent: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
    point_desc: { createdAt: "desc" },
    point_asc: { createdAt: "asc" },
  }[sort] ?? { createdAt: "desc" };

  res.status(200).json({ message: "스터디 목록 조회 성공", data: [] });
});
