/*
  Warnings:

  - A unique constraint covering the columns `[subscriptionId]` on the table `user_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."PlanType" AS ENUM ('FREE', 'BOOSTED', 'PREMIUM');

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planType" "public"."PlanType" NOT NULL,
    "dailyGenerations" INTEGER NOT NULL,
    "toneStylesAllowed" INTEGER NOT NULL,
    "publicFeedAccess" BOOLEAN NOT NULL,
    "communitySharing" BOOLEAN NOT NULL,
    "postInteraction" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "public"."Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_subscriptionId_key" ON "public"."user_profiles"("subscriptionId");

-- AddForeignKey
ALTER TABLE "public"."user_profiles" ADD CONSTRAINT "user_profiles_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
