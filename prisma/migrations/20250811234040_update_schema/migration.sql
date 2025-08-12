/*
  Warnings:

  - A unique constraint covering the columns `[stripeInvoiceId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_userId_fkey";

-- DropIndex
DROP INDEX "public"."payments_userId_key";

-- AlterTable
ALTER TABLE "public"."payments" ADD COLUMN     "periodEnd" TIMESTAMP(3),
ADD COLUMN     "periodStart" TIMESTAMP(3),
ADD COLUMN     "stripeInvoiceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeInvoiceId_key" ON "public"."payments"("stripeInvoiceId");

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
