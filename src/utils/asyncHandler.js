const asyncHandler = (controller) => {
  return async (req, res) => {
    try {
      await controller(req, res);
    } catch (err) {
      console.error(err);

      if (err.code === "P2025") {
        return res.status(404).json({
          message: "요청한 데이터를 찾을 수 없습니다.",
        });
      }

      if (err.code === "P2002") {
        return res.status(409).json({
          message: "이미 존재하는 데이터입니다.",
        });
      }

      if (err.code === "P2003") {
        return res.status(400).json({
          message: "잘못된 요청입니다.",
        });
      }

      if (err.statusCode) {
        return res.status(err.statusCode).json({
          message: err.message,
        });
      }

      return res.status(500).json({
        message: "서버 내부 오류가 발생했습니다.",
      });
    }
  };
};

export default asyncHandler;
