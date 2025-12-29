-- CreateEnum
CREATE TYPE "ApplePurchaseStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REFUNDED', 'REVOKED');

-- CreateTable
CREATE TABLE "ApplePurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT,
    "planId" TEXT,
    "transactionId" TEXT,
    "originalTransactionId" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "expiresDate" TIMESTAMP(3),
    "revocationDate" TIMESTAMP(3),
    "signedTransactionInfo" TEXT,
    "signedRenewalInfo" TEXT,
    "recipt" TEXT,
    "status" "ApplePurchaseStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplePurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplePurchase_transactionId_key" ON "ApplePurchase"("transactionId");

-- AddForeignKey
ALTER TABLE "ApplePurchase" ADD CONSTRAINT "ApplePurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "credentials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
