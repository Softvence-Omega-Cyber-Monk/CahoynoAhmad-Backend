/*
  Warnings:

  - You are about to drop the column `creditBalance` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."user_profiles" DROP CONSTRAINT "user_profiles_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "public"."user_profiles" DROP COLUMN "creditBalance";

-- DropTable
DROP TABLE "public"."Subscription";

-- CreateTable
CREATE TABLE "public"."subscriptions" (
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

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "public"."subscriptions"("userId");

-- AddForeignKey
ALTER TABLE "public"."user_profiles" ADD CONSTRAINT "user_profiles_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
