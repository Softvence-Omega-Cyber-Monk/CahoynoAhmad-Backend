/*
  Warnings:

  - You are about to drop the column `angry` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `care` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `haha` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `love` on the `Reaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[postId,userId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ReactionType" AS ENUM ('HAHA', 'ANGRY', 'CARE', 'LOVE');

-- AlterTable
ALTER TABLE "public"."Reaction" DROP COLUMN "angry",
DROP COLUMN "care",
DROP COLUMN "haha",
DROP COLUMN "love",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type" "public"."ReactionType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_postId_userId_key" ON "public"."Reaction"("postId", "userId");
