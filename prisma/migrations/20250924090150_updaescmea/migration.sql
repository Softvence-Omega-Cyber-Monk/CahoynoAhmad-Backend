-- AlterTable
ALTER TABLE "public"."Quest" ADD COLUMN     "ayahId" INTEGER,
ADD COLUMN     "surahId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Quest" ADD CONSTRAINT "Quest_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "public"."Surah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quest" ADD CONSTRAINT "Quest_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "public"."Ayah"("id") ON DELETE SET NULL ON UPDATE CASCADE;
