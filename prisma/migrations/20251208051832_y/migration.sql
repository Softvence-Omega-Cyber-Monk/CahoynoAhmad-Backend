/*
  Warnings:

  - Added the required column `orderIndex` to the `GameData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameData" ADD COLUMN     "orderIndex" INTEGER NOT NULL;
