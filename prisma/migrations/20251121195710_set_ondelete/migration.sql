-- DropForeignKey
ALTER TABLE "public"."GameData" DROP CONSTRAINT "GameData_ayahId_fkey";

-- DropForeignKey
ALTER TABLE "public"."GameData" DROP CONSTRAINT "GameData_duaName_fkey";

-- DropForeignKey
ALTER TABLE "public"."GameData" DROP CONSTRAINT "GameData_surahId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Quest" DROP CONSTRAINT "Quest_ayahId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Quest" DROP CONSTRAINT "Quest_surahId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserAnswer" DROP CONSTRAINT "UserAnswer_gameId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserQuest" DROP CONSTRAINT "UserQuest_questId_fkey";

-- AddForeignKey
ALTER TABLE "GameData" ADD CONSTRAINT "GameData_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "Ayah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameData" ADD CONSTRAINT "GameData_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "Surah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameData" ADD CONSTRAINT "GameData_duaName_fkey" FOREIGN KEY ("duaName") REFERENCES "Dua"("duaName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "GameData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "Ayah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "Surah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
