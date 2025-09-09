/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Surah` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Surah_name_key" ON "public"."Surah"("name");
