// 모든 HTTP 에러의 부모 클래스
export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 자주 쓰는 상태코드는 미리 클래스로 만들어둠
export class NotFoundError extends HttpError {
  constructor(message = "리소스를 찾을 수 없습니다") {
    super(404, message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "잘못된 요청입니다") {
    super(400, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "인증이 필요합니다") {
    super(401, message);
  }
}
