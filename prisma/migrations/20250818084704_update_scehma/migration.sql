/*
  Warnings:

  - You are about to drop the column `resetToken` on the `user_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."credentials" ADD COLUMN     "resetToken" TEXT;

-- AlterTable
ALTER TABLE "public"."user_profiles" DROP COLUMN "resetToken";
