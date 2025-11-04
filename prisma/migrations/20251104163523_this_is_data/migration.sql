-- DropForeignKey
ALTER TABLE "public"."UserAnswer" DROP CONSTRAINT "UserAnswer_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserGameProgress" DROP CONSTRAINT "UserGameProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserQuest" DROP CONSTRAINT "UserQuest_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User_Stat" DROP CONSTRAINT "User_Stat_user_id_fkey";

-- AddForeignKey
ALTER TABLE "UserGameProgress" ADD CONSTRAINT "UserGameProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Stat" ADD CONSTRAINT "User_Stat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
