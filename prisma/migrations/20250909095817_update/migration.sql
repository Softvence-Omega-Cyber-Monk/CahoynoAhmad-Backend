-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN');

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
    "totalXP" TEXT,
    "isSubscribe" BOOLEAN NOT NULL DEFAULT false,
    "subscription" TEXT,
    "leavel" INTEGER DEFAULT 0,
    "ayahRead" INTEGER DEFAULT 0,
    "practiceTime" INTEGER DEFAULT 0,
    "questCompleted" INTEGER DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Surah" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,

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

-- CreateIndex
CREATE UNIQUE INDEX "credentials_email_key" ON "public"."credentials"("email");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_phone_key" ON "public"."credentials"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Surah_number_key" ON "public"."Surah"("number");

-- AddForeignKey
ALTER TABLE "public"."Ayah" ADD CONSTRAINT "Ayah_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "public"."Surah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
