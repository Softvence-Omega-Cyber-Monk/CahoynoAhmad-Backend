/*
  Warnings:

  - Added the required column `userName` to the `credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."credentials" ADD COLUMN     "userName" TEXT NOT NULL;
