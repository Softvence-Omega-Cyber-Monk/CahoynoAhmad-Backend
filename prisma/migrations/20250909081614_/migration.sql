/*
  Warnings:

  - The values [TRAINEE] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `Department` on the `credentials` table. All the data in the column will be lost.
  - You are about to drop the column `Institution` on the `credentials` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `credentials` table. All the data in the column will be lost.
  - You are about to drop the column `isApproved` on the `credentials` table. All the data in the column will be lost.
  - You are about to drop the column `jurisdiction` on the `credentials` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `credentials` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `credentials` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `credentials` table. All the data in the column will be lost.
  - You are about to drop the `IncidentReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Medication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Oxygen` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProtocolStep` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SOP` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserRole_new" AS ENUM ('USER', 'ADMIN');
ALTER TYPE "public"."UserRole" RENAME TO "UserRole_old";
ALTER TYPE "public"."UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Medication" DROP CONSTRAINT "Medication_sopId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Oxygen" DROP CONSTRAINT "Oxygen_sopId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProtocolStep" DROP CONSTRAINT "ProtocolStep_sopId_fkey";

-- AlterTable
ALTER TABLE "public"."credentials" DROP COLUMN "Department",
DROP COLUMN "Institution",
DROP COLUMN "firstName",
DROP COLUMN "isApproved",
DROP COLUMN "jurisdiction",
DROP COLUMN "lastName",
DROP COLUMN "specialization",
DROP COLUMN "status",
ADD COLUMN     "ayahRead" INTEGER DEFAULT 0,
ADD COLUMN     "budge" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dayStrek" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isSubscribe" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leavel" INTEGER DEFAULT 0,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "practiceTime" INTEGER DEFAULT 0,
ADD COLUMN     "questCompleted" INTEGER DEFAULT 0,
ADD COLUMN     "subscription" TEXT,
ADD COLUMN     "totalXP" TEXT,
ALTER COLUMN "role" SET DEFAULT 'USER';

-- DropTable
DROP TABLE "public"."IncidentReport";

-- DropTable
DROP TABLE "public"."Medication";

-- DropTable
DROP TABLE "public"."Oxygen";

-- DropTable
DROP TABLE "public"."ProtocolStep";

-- DropTable
DROP TABLE "public"."SOP";

-- DropEnum
DROP TYPE "public"."SOPStatus";

-- DropEnum
DROP TYPE "public"."Situation";

-- DropEnum
DROP TYPE "public"."Status";
