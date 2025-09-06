/*
  Warnings:

  - You are about to drop the column `isEmergency` on the `SOP` table. All the data in the column will be lost.
  - You are about to drop the column `protocol_stpes` on the `SOP` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."SOPStatus" AS ENUM ('Draft', 'Published', 'Critical');

-- AlterTable
ALTER TABLE "public"."SOP" DROP COLUMN "isEmergency",
DROP COLUMN "protocol_stpes",
ADD COLUMN     "author" TEXT,
ADD COLUMN     "status" "public"."SOPStatus" NOT NULL DEFAULT 'Draft',
ALTER COLUMN "isDraft" SET DEFAULT true;

-- CreateTable
CREATE TABLE "public"."ProtocolStep" (
    "id" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT,
    "sopId" TEXT NOT NULL,

    CONSTRAINT "ProtocolStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Medication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dose" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "repeat" TEXT,
    "sopId" TEXT NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Oxygen" (
    "id" TEXT NOT NULL,
    "dose" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "repeat" TEXT,
    "sopId" TEXT NOT NULL,

    CONSTRAINT "Oxygen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Oxygen_sopId_key" ON "public"."Oxygen"("sopId");

-- AddForeignKey
ALTER TABLE "public"."ProtocolStep" ADD CONSTRAINT "ProtocolStep_sopId_fkey" FOREIGN KEY ("sopId") REFERENCES "public"."SOP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Medication" ADD CONSTRAINT "Medication_sopId_fkey" FOREIGN KEY ("sopId") REFERENCES "public"."SOP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Oxygen" ADD CONSTRAINT "Oxygen_sopId_fkey" FOREIGN KEY ("sopId") REFERENCES "public"."SOP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
