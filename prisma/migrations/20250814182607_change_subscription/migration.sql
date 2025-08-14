/*
  Warnings:

  - Added the required column `billingCycle` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceAmount` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceId` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."BillingCycle" AS ENUM ('MONTHLY', 'YEARLY', 'ONE_TIME', 'LIFETIME');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."PlanType" ADD VALUE 'SIPT_FOR_BRANDS';
ALTER TYPE "public"."PlanType" ADD VALUE 'ONE_TIME_ROAST';
ALTER TYPE "public"."PlanType" ADD VALUE 'LIFETIME_NO_FILTER';
ALTER TYPE "public"."PlanType" ADD VALUE 'LIFETIME_SAVAGE_MODE';

-- AlterTable
ALTER TABLE "public"."subscriptions" ADD COLUMN     "billingCycle" "public"."BillingCycle" NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "priceAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "priceId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL;
