/*
  Warnings:

  - The `totalXP` column on the `credentials` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."credentials" DROP COLUMN "totalXP",
ADD COLUMN     "totalXP" INTEGER;
