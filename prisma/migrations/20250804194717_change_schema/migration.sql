/*
  Warnings:

  - You are about to drop the column `userId` on the `subscriptions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."subscriptions_userId_key";

-- AlterTable
ALTER TABLE "public"."subscriptions" DROP COLUMN "userId";
