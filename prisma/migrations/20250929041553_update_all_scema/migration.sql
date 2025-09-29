-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."QuestType" AS ENUM ('DAILY', 'WEEKLY');

-- CreateEnum
CREATE TYPE "public"."QuestStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."credentials" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dayStrek" INTEGER NOT NULL DEFAULT 0,
    "budge" INTEGER NOT NULL DEFAULT 0,
    "resetToken" TEXT,
    "image" TEXT,
    "totalXP" INTEGER,
    "isSubscribe" BOOLEAN NOT NULL DEFAULT false,
    "subscription" TEXT NOT NULL DEFAULT 'FREE',
    "leavel" INTEGER DEFAULT 0,
    "ayahRead" INTEGER DEFAULT 0,
    "practiceTime" INTEGER DEFAULT 0,
    "questCompleted" INTEGER DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "affiliateLink" TEXT,
    "referCode" TEXT,
    "totalAffiliate" INTEGER NOT NULL DEFAULT 0,
    "totalClick" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" TIMESTAMP(3),
    "otp" INTEGER,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GameData" (
    "id" TEXT NOT NULL,
    "surahId" INTEGER,
    "ayahId" INTEGER,
    "arabicText" TEXT,
    "englishText" TEXT,
    "audioUrl" TEXT,
    "correct" TEXT NOT NULL,
    "options" TEXT[],
    "correctArabic" TEXT NOT NULL,
    "optionsArabic" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserGameProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "surahId" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserGameProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAnswer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCorrect" BOOLEAN NOT NULL,
    "totalAns" INTEGER,

    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "type" "public"."QuestType" NOT NULL DEFAULT 'DAILY',
    "surahId" INTEGER,
    "ayahId" INTEGER,
    "targetCount" INTEGER,
    "targetSurah" INTEGER,
    "targetJuz" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserQuest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "status" "public"."QuestStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "UserQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Note" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Surah" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "juzId" INTEGER,

    CONSTRAINT "Surah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ayah" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "surahId" INTEGER NOT NULL,

    CONSTRAINT "Ayah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Juz" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Juz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User_Stat" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "ayahs_read" INTEGER NOT NULL,
    "minutes_read" INTEGER NOT NULL,
    "quest_complete" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_Stat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credentials_email_key" ON "public"."credentials"("email");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_phone_key" ON "public"."credentials"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "UserQuest_userId_questId_key" ON "public"."UserQuest"("userId", "questId");

-- CreateIndex
CREATE UNIQUE INDEX "Surah_number_key" ON "public"."Surah"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Surah_name_key" ON "public"."Surah"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_Stat_user_id_key" ON "public"."User_Stat"("user_id");

-- AddForeignKey
ALTER TABLE "public"."GameData" ADD CONSTRAINT "GameData_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "public"."Surah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameData" ADD CONSTRAINT "GameData_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "public"."Ayah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserGameProgress" ADD CONSTRAINT "UserGameProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."credentials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAnswer" ADD CONSTRAINT "UserAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."credentials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAnswer" ADD CONSTRAINT "UserAnswer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."GameData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quest" ADD CONSTRAINT "Quest_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "public"."Surah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quest" ADD CONSTRAINT "Quest_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "public"."Ayah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserQuest" ADD CONSTRAINT "UserQuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."credentials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserQuest" ADD CONSTRAINT "UserQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "public"."Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Surah" ADD CONSTRAINT "Surah_juzId_fkey" FOREIGN KEY ("juzId") REFERENCES "public"."Juz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ayah" ADD CONSTRAINT "Ayah_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "public"."Surah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User_Stat" ADD CONSTRAINT "User_Stat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."credentials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
