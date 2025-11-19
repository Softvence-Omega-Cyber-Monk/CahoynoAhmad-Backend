/*
  Warnings:

  - You are about to drop the column `duaReletionName` on the `Dua` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[duaName]` on the table `Dua` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `duaName` to the `Dua` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."GameData" DROP CONSTRAINT "GameData_duaName_fkey";

-- DropIndex
DROP INDEX "public"."Dua_duaReletionName_key";

-- AlterTable
ALTER TABLE "Dua" DROP COLUMN "duaReletionName",
ADD COLUMN     "duaName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dua_duaName_key" ON "Dua"("duaName");

-- AddForeignKey
ALTER TABLE "GameData" ADD CONSTRAINT "GameData_duaName_fkey" FOREIGN KEY ("duaName") REFERENCES "Dua"("duaName") ON DELETE SET NULL ON UPDATE CASCADE;
