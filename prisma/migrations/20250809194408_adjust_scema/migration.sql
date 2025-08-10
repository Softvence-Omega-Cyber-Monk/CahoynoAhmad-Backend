/*
  Warnings:

  - The values [BOOSTED,PREMIUM] on the enum `PlanType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PlanType_new" AS ENUM ('FREE', 'HOT_MESS', 'NO_FILTER', 'SAVAGE_MODE');
ALTER TABLE "public"."subscriptions" ALTER COLUMN "planType" TYPE "public"."PlanType_new" USING ("planType"::text::"public"."PlanType_new");
ALTER TYPE "public"."PlanType" RENAME TO "PlanType_old";
ALTER TYPE "public"."PlanType_new" RENAME TO "PlanType";
DROP TYPE "public"."PlanType_old";
COMMIT;

-- DropIndex
DROP INDEX "public"."user_profiles_subscriptionId_key";

-- AlterTable
ALTER TABLE "public"."user_profiles" ADD COLUMN     "subscriptionName" TEXT NOT NULL DEFAULT 'FREE';
