/*
  Warnings:

  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `credentials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."user_profiles" DROP CONSTRAINT "user_profiles_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_profiles" DROP CONSTRAINT "user_profiles_userId_fkey";

-- DropTable
DROP TABLE "public"."Subscription";

-- DropTable
DROP TABLE "public"."credentials";

-- DropTable
DROP TABLE "public"."user_profiles";

-- DropEnum
DROP TYPE "public"."PlanType";

-- DropEnum
DROP TYPE "public"."UserRole";
