/*
  Warnings:

  - You are about to drop the column `affiliateToken` on the `credentials` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."credentials" DROP COLUMN "affiliateToken",
ADD COLUMN     "affiliateLink" TEXT,
ADD COLUMN     "totalAffiliate" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalClick" INTEGER NOT NULL DEFAULT 0;
