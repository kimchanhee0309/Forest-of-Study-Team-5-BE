const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  /* Prisma 레코드 없음 */
  if (error.code === "P2025") {
    return res.status(404).json({
      message: "요청한 데이터를 찾을 수 없습니다.",
    });
  }

  /* Prisma Unique 제약조건 */
  if (error.code === "P2002") {
    return res.status(409).json({
      message: "이미 존재하는 데이터입니다.",
    });
  }

  /* Prisma FK 에러 */
  if (error.code === "P2003") {
    return res.status(400).json({
      message: "잘못된 요청입니다.",
    });
  }

  /* 직접 만든 에러 */
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: "서버 내부 오류가 발생했습니다.",
  });
};

export default errorMiddleware;
