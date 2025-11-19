-- AddForeignKey
ALTER TABLE "GameData" ADD CONSTRAINT "GameData_duaName_fkey" FOREIGN KEY ("duaName") REFERENCES "Dua"("duaReletionName") ON DELETE SET NULL ON UPDATE CASCADE;
