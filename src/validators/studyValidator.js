// 스터디 생성 입력값 검사

export function validateStudyCreate(req, res, next) {
  const { nickname, title, password } = req.body;

// 닉네임 필수 확인
if (!nickname || !nickname.trim()) {
  return res.status(400).json({
    success: false,
    message: "닉네임을 입력해주세요."
  });
}

  // 스터디 이름 필수 확인
  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "스터디 이름을 입력해주세요."
    });
  }

  // 비밀번호 필수 확인
    if (!password || !password.trim()) {
    return res.status(400).json({
      success: false,
      message: "비밀번호를 입력해주세요."
    });
  }

  next();
}

