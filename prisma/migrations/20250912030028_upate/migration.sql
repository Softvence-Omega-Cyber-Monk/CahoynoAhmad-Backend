/*
  Warnings:

  - The `surahId` column on the `GameData` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ayahId` column on the `GameData` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."GameData" DROP COLUMN "surahId",
ADD COLUMN     "surahId" INTEGER,
DROP COLUMN "ayahId",
ADD COLUMN     "ayahId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."GameData" ADD CONSTRAINT "GameData_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "public"."Surah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameData" ADD CONSTRAINT "GameData_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "public"."Ayah"("id") ON DELETE SET NULL ON UPDATE CASCADE;
