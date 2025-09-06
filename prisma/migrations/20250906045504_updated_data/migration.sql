/*
  Warnings:

  - The values [TRAINE] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserRole_new" AS ENUM ('ADMIN', 'TRAINEE');
ALTER TYPE "public"."UserRole" RENAME TO "UserRole_old";
ALTER TYPE "public"."UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."credentials" ADD COLUMN     "Department" TEXT,
ADD COLUMN     "Institution" TEXT,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jurisdiction" TEXT,
ADD COLUMN     "specialization" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';
