-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "QuestType" AS ENUM ('DAILY', 'WEEKLY');

-- CreateEnum
CREATE TYPE "QuestStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "WithdrawStatus" AS ENUM ('PENDING', 'APPROVED', 'PROCESSING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "credentials" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dayStrek" INTEGER NOT NULL DEFAULT 0,
    "budge" INTEGER NOT NULL DEFAULT 0,
    "resetToken" TEXT,
    "image" TEXT,
    "isSubscribe" BOOLEAN NOT NULL DEFAULT false,
    "subscription" TEXT NOT NULL DEFAULT 'FREE',
    "leavel" INTEGER DEFAULT 0,
    "ayahRead" INTEGER DEFAULT 0,
    "practiceTime" INTEGER DEFAULT 0,
    "questCompleted" INTEGER DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "affiliateLink" TEXT,
    "totalAffiliate" INTEGER NOT NULL DEFAULT 0,
    "totalClick" INTEGER NOT NULL DEFAULT 0,
    "referCode" TEXT,
    "fcmToken" TEXT,
    "lastActiveDate" TIMESTAMP(3),
    "totalXP" INTEGER DEFAULT 0,
    "total_earnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "progress" DOUBLE PRECISION DEFAULT 0,
    "otp" INTEGER,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameData" (
    "id" TEXT NOT NULL,
    "arabicText" TEXT,
    "indonesianText" TEXT,
    "audioUrl" TEXT,
    "correctArabic" TEXT NOT NULL,
    "optionsArabic" TEXT[],
    "correctEnglish" TEXT NOT NULL,
    "optionsEnglish" TEXT[],
    "correctIndonesian" TEXT NOT NULL,
    "optionsIndonesian" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "surahId" INTEGER,
    "ayahId" INTEGER,
    "dataType" TEXT,
    "duaName" TEXT,
    "orderIndex" INTEGER NOT NULL,

    CONSTRAINT "GameData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGameProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "surahId" INTEGER,
    "duaName" TEXT,
    "score" INTEGER DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserGameProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnswer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCorrect" BOOLEAN NOT NULL,
    "totalAns" INTEGER,

    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "type" "QuestType" NOT NULL DEFAULT 'DAILY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ayahId" INTEGER,
    "surahId" INTEGER,
    "targetCount" INTEGER,
    "targetJuz" INTEGER,
    "targetSurah" INTEGER,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "status" "QuestStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "UserQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "planId" TEXT,
    "planName" TEXT,
    "userId" TEXT,
    "userEmail" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "features" TEXT[],
    "priceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Surah" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "juzId" INTEGER,

    CONSTRAINT "Surah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ayah" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "surahId" INTEGER NOT NULL,

    CONSTRAINT "Ayah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dua" (
    "id" SERIAL NOT NULL,
    "duaDisplayName" TEXT,
    "duaName" TEXT NOT NULL,
    "measing" TEXT,

    CONSTRAINT "Dua_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Juz" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Juz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surahIcon" (
    "id" TEXT NOT NULL,
    "surahNumber" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surahIcon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Stat" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "ayahs_read" INTEGER NOT NULL,
    "minutes_read" INTEGER NOT NULL,
    "quest_complete" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_Stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawalRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "bankCode" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "status" "WithdrawStatus" NOT NULL DEFAULT 'PENDING',
    "xenditId" TEXT,
    "failureMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WithdrawalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGameProgress_userId_surahId_duaName_key" ON "UserGameProgress"("userId", "surahId", "duaName");

-- CreateIndex
CREATE UNIQUE INDEX "UserQuest_userId_questId_key" ON "UserQuest"("userId", "questId");

-- CreateIndex
CREATE UNIQUE INDEX "Surah_number_key" ON "Surah"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Surah_name_key" ON "Surah"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Dua_duaName_key" ON "Dua"("duaName");

-- CreateIndex
CREATE UNIQUE INDEX "User_Stat_user_id_key" ON "User_Stat"("user_id");

-- AddForeignKey
ALTER TABLE "GameData" ADD CONSTRAINT "GameData_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "Ayah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameData" ADD CONSTRAINT "GameData_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "Surah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameData" ADD CONSTRAINT "GameData_duaName_fkey" FOREIGN KEY ("duaName") REFERENCES "Dua"("duaName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGameProgress" ADD CONSTRAINT "UserGameProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "GameData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "Ayah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "Surah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surah" ADD CONSTRAINT "Surah_juzId_fkey" FOREIGN KEY ("juzId") REFERENCES "Juz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ayah" ADD CONSTRAINT "Ayah_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "Surah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Stat" ADD CONSTRAINT "User_Stat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "credentials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
