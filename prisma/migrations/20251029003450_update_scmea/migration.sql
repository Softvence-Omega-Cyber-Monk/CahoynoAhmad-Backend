/*
  Warnings:

  - You are about to drop the column `status` on the `credentials` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "credentials" DROP COLUMN "status",
ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "public"."UserStatus";
