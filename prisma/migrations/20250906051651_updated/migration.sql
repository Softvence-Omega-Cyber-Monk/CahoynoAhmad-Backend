/*
  Warnings:

  - The `protocol_stpes` column on the `SOP` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `overview` to the `SOP` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SOP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."SOP" ADD COLUMN     "contraindications" TEXT[],
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "indications" TEXT[],
ADD COLUMN     "overview" TEXT NOT NULL,
ADD COLUMN     "required_equipment" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "protocol_stpes",
ADD COLUMN     "protocol_stpes" TEXT[];
