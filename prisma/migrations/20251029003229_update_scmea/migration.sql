-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('BLOCKED', 'OPEN');

-- AlterTable
ALTER TABLE "credentials" ADD COLUMN     "status" "UserStatus" DEFAULT 'OPEN';
