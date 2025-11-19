/*
  Warnings:

  - You are about to drop the column `correct` on the `GameData` table. All the data in the column will be lost.
  - Added the required column `correctIndonesian` to the `GameData` table without a default value. This is not possible if the table is not empty.
  - Made the column `correctEnglish` on table `GameData` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GameData" DROP COLUMN "correct",
ADD COLUMN     "correctIndonesian" TEXT NOT NULL,
ALTER COLUMN "correctEnglish" SET NOT NULL;
