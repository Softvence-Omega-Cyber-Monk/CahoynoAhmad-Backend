/*
  Warnings:

  - You are about to drop the column `englishText` on the `GameData` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `GameData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GameData" DROP COLUMN "englishText",
DROP COLUMN "options",
ADD COLUMN     "indonesianText" TEXT,
ADD COLUMN     "optionsIndonesian" TEXT[];
