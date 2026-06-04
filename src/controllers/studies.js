import { PrismaClient } from "@prisma/client";
import asyncHandler from "../utils/asyncHandler.js";
import dayjs from "dayjs";

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

  // prisma 목록 조회

  const studies = await prisma.study.findMany({
    where, // 검색, 필터 조건
    orderBy, // 정렬 조건
    skip, // 페이지네이션 (건너뜀 갯수)
    take: limitNum, // 페이지네이션(한 번에 6개씩)
    select: {
      id: true,
      nickname: true,
      title: true,
      background: true,
      totalPoint: true,
      description: true,
      createdAt: true,
      studyEmojis: true,
    },
  });
  const totalCount = await prisma.study.count({ where });

  //경과일 수 계산
  const today = dayjs(); // 오늘 날짜 기준점

  const studiesWithElapsedDays = studies.map((study) => {
    const createdDate = dayjs(study.createdAt);
    // 생성일부터 오늘까지 지난 일 수 계산 (+1)
    const elapsedDays = today.diff(createdDate, "day") + 1;

    return {
      ...study,
      elapsedDays,
    };
  });

  res
    .status(200)
    .json({
      message: "스터디 목록 조회 성공",
      data: studiesWithElapsedDays,
      totalCount,
    });
});
