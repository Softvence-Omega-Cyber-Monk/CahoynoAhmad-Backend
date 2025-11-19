/*
  Warnings:

  - A unique constraint covering the columns `[userId,surahId,duaName]` on the table `UserGameProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dataType` to the `UserGameProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserGameProgress" ADD COLUMN     "dataType" TEXT NOT NULL,
ADD COLUMN     "duaName" TEXT,
ALTER COLUMN "surahId" DROP NOT NULL,
ALTER COLUMN "score" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "UserGameProgress_userId_surahId_duaName_key" ON "UserGameProgress"("userId", "surahId", "duaName");
