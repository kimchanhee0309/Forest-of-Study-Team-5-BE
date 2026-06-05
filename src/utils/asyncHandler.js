import { Prisma } from "@prisma/client";
import { HttpError } from "./errors.js";
import { ZodError } from "zod";

export const asyncHandler = (controller) => async (req, res, next) => {
  try {
    // 진짜 컨트롤러 실행
    await controller(req, res, next);
  } catch (error) {
    // 1) 우리가 직접 던진 HTTP 에러 (NotFoundError 등)
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    // 2) Prisma가 던진 알려진 에러(코드별 매핑)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025: 찾을 행이 없음
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "리소스를 찾을 수 없습니다",
        });
      }

      // P2002: UNIQUE 제약 위반
      if (error.code == "P2002") {
        return res.status(409).json({
          success: false,
          message: "이미 존재하는 데이터입니다.",
          field: error.meta?.target,
        });
      }

      // P2003: 외래 키 제약 위반
      if (error.code === "P2003") {
        return res.status(400).json({
          success: false,
          message: "참조 무결성 제약 조건 위반",
        });
      }
    }

    // 3) Prisma validation 에러(타입 불일치 등)
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({
        success: false,
        message: "Prisma validation 에러",
        detail: error.message.split("\n").slice(-2).join(" "),
      });
    }

    // 4) Zod validation 에러
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "입력값 검증에 실패했습니다.",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    // 5) 그 외 알 수 없는 에러 -> 서버 로그에 전체 남기고, 사용자에겐 500
    console.error(error);
    res.status(500).json({
      success: false,
      message: "서버 에러가 발생했습니다",
    });
  }
};
