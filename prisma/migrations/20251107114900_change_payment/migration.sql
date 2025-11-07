-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "userEmail" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;
