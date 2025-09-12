/*
  Warnings:

  - Added the required column `correctArabic` to the `GameData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."GameData" ADD COLUMN     "correctArabic" TEXT NOT NULL,
ADD COLUMN     "optionsArabic" TEXT[];
