-- CreateEnum
CREATE TYPE "FocusStatus" AS ENUM ('ongoing', 'paused', 'completed');

-- CreateTable
CREATE TABLE "studies" (
    "id" SERIAL NOT NULL,
    "nickname" VARCHAR(30) NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "background" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "totalPoint" INTEGER NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habits" (
    "id" SERIAL NOT NULL,
    "studyId" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "startDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habit_logs" (
    "id" SERIAL NOT NULL,
    "habitId" INTEGER NOT NULL,
    "checkedDate" DATE NOT NULL,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "focus_sessions" (
    "id" SERIAL NOT NULL,
    "studyId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "targetMinutes" INTEGER NOT NULL,
    "durationSeconds" INTEGER,
    "earnedPoint" INTEGER NOT NULL DEFAULT 0,
    "status" "FocusStatus" NOT NULL DEFAULT 'ongoing',

    CONSTRAINT "focus_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_emojis" (
    "id" SERIAL NOT NULL,
    "studyId" INTEGER NOT NULL,
    "emoji" VARCHAR(10) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "study_emojis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "habit_logs_habitId_checkedDate_key" ON "habit_logs"("habitId", "checkedDate");

-- CreateIndex
CREATE UNIQUE INDEX "study_emojis_studyId_emoji_key" ON "study_emojis"("studyId", "emoji");

-- AddForeignKey
ALTER TABLE "habits" ADD CONSTRAINT "habits_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "focus_sessions" ADD CONSTRAINT "focus_sessions_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_emojis" ADD CONSTRAINT "study_emojis_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
