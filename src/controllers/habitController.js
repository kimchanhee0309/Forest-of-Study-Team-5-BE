import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. 비밀번호 검증 (POST)
export const verifyHabitPassword = async (req, res) => {
   try {
      const studyId = Number(req.params.studyId);
      const { password } = req.body;

      // URL 파라미터로 넘어온 ID로 해당 스터디 찾기
      const study = await prisma.study.findUnique({ where: { id: studyId } });

      // 스터디 데이터가 없는 경우 예외 처리
      if (!study) {
         return res.status(404).json({ message: "스터디를 찾을 수 없습니다." });
      }

      // 사용자가 입력한 비밀번호랑 DB 비밀번호가 맞는지 체크
      if (study.password !== password) {
         return res
            .status(401)
            .json({ message: "비밀번호가 일치하지 않습니다." });
      }

      return res.status(200).json({ message: "비밀번호가 확인되었습니다." });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류" });
   }
};

// 2. 당일 습관 조회 (GET)
export const getDailyHabits = async (req, res) => {
   try {
      const studyId = Number(req.params.studyId);

      // 오늘 날짜 구해서 시간 분 초 값만 다 0으로 초기화하기
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const habits = await prisma.habit.findMany({
         where: {
            studyId: studyId,
            endDate: null, // 아직 종료 버튼 안 누른 진행 중인 습관만 가져오기
         },
         include: {
            habitLogs: {
               where: {
                  checkedDate: {
                     gte: today, // 오늘 날짜보다 크거나 같고
                     lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // 하루 더한 내일보다 작은 범위 필터링
                  },
               },
            },
         },
         orderBy: { orderIndex: "asc" }, // 정렬 순서대로 데이터 나열
      });

      return res.status(200).json(habits);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류" });
   }
};

// 3. 이번주 습관 로그 생성 (POST)
export const createWeeklyHabitLog = async (req, res) => {
   try {
      const studyId = Number(req.params.studyId);
      const { title } = req.body; // 프론트에서 받아올 습관 타이틀

      // 예외 처리: 습관 이름 안 넘겨주면 에러 반환
      if (!title) {
         return res.status(400).json({ message: "습관 이름을 입력해주세요." });
      }

      // 먼저 기본 습관 데이터부터 DB에 생성하기
      const newHabit = await prisma.habit.create({
         data: { studyId, title },
      });

      // 기획 규칙에 맞춰서 이번 주 월요일 날짜 계산 로직 시작
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentDay = today.getDay(); // 일요일이 0이고 월요일이 1임
      const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

      const monday = new Date(today);
      monday.setDate(today.getDate() + distanceToMonday);

      // 월요일 기준으로 반복문 돌려서 일요일까지 7일치 날짜 채워넣기
      const logDates = [];
      for (let i = 0; i < 7; i++) {
         const targetDate = new Date(monday);
         targetDate.setDate(monday.getDate() + i);
         logDates.push(targetDate);
      }

      // 위에서 생성한 습관 ID를 들고가서 7일치 빈 체크 로그 한 번에 다 만들기
      await prisma.habitLog.createMany({
         data: logDates.map((date) => ({
            habitId: newHabit.id,
            checkedDate: date,
            isChecked: false, // 처음 만드는 거니까 기본값 false로 설정
         })),
      });

      return res.status(201).json({
         message: "이번주 습관 및 로그가 생성되었습니다.",
         habit: newHabit,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류" });
   }
};

// 4. 당일 습관 달성 상태 업데이트 (PATCH)
export const updateHabitLogStatus = async (req, res) => {
   try {
      const habitId = Number(req.params.habitId);
      const { date, isChecked } = req.body; // 체크 여부랑 날짜 받아오기

      // 바디에 날짜 없으면 그냥 오늘 날짜 기준으로 설정하고 시 분 초 날리기
      const targetDate = date ? new Date(date) : new Date();
      targetDate.setHours(0, 0, 0, 0);

      // 수정 타겟이 되는 해당 날짜의 단일 로그 찾기
      const log = await prisma.habitLog.findFirst({
         where: {
            habitId: habitId,
            checkedDate: {
               gte: targetDate,
               lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
            },
         },
      });

      // 해당하는 로그 데이터가 없으면 예외 처리
      if (!log) {
         return res
            .status(404)
            .json({ message: "해당 날짜의 로그를 찾을 수 없습니다." });
      }

      // 찾은 로그의 id값 매칭해서 완료 체크 여부(true/false) 바꾸기
      const updatedLog = await prisma.habitLog.update({
         where: { id: log.id },
         data: { isChecked: isChecked },
      });

      return res.status(200).json(updatedLog);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류" });
   }
};

// 5. 등록된 습관 이름 수정 (PATCH)
export const updateHabitName = async (req, res) => {
   try {
      const habitId = Number(req.params.habitId);
      const { title } = req.body;

      if (!title) {
         return res
            .status(400)
            .json({ message: "변경할 습관 이름을 입력해주세요." });
      }

      // 받아온 새로운 타이틀 정보로 습관 테이블 업데이트
      const updatedHabit = await prisma.habit.update({
         where: { id: habitId },
         data: { title: title },
      });

      return res.status(200).json(updatedHabit);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류" });
   }
};

// 6. 습관 종료 (PATCH)
export const endHabit = async (req, res) => {
   try {
      const habitId = Number(req.params.habitId);

      // 완전히 삭제하지 않고 endDate 컬럼에 오늘 날짜 찍어서 종료 처리하기
      const endedHabit = await prisma.habit.update({
         where: { id: habitId },
         data: { endDate: new Date() },
      });

      return res
         .status(200)
         .json({ message: "습관이 종료되었습니다.", endedHabit });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류" });
   }
};

// 7. 주간 달성 기록 데이터 조회 (GET)
export const getWeeklyHabitLogs = async (req, res) => {
   try {
      const studyId = Number(req.params.studyId);

      // 이번 주 범위 필터링을 위해서 월요일이랑 다음 주 월요일 날짜 미리 구하기
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentDay = today.getDay();
      const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

      const monday = new Date(today);
      monday.setDate(today.getDate() + distanceToMonday);

      const nextMonday = new Date(monday);
      nextMonday.setDate(monday.getDate() + 7);

      // 이번 주 일주일치 범위 내에 있는 습관 체크 로그만 포함해서 가져오기
      const habitsWithLogs = await prisma.habit.findMany({
         where: { studyId: studyId },
         include: {
            habitLogs: {
               where: {
                  checkedDate: {
                     gte: monday, // 이번 주 월요일부터
                     lt: nextMonday, // 다음 주 월요일 전까지
                  },
               },
               orderBy: { checkedDate: "asc" }, // 요일 순서대로 정렬해서 반환
            },
         },
      });

      return res.status(200).json(habitsWithLogs);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 오류" });
   }
};
