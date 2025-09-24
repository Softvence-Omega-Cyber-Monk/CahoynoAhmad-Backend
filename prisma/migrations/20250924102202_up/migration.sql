-- AlterTable
ALTER TABLE "public"."Surah" ADD COLUMN     "juzId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Juz" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Juz_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Surah" ADD CONSTRAINT "Surah_juzId_fkey" FOREIGN KEY ("juzId") REFERENCES "public"."Juz"("id") ON DELETE SET NULL ON UPDATE CASCADE;
