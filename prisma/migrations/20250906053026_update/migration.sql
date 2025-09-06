/*
  Warnings:

  - The values [Draft,Published,Critical] on the enum `SOPStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."SOPStatus_new" AS ENUM ('Procedure', 'Emergence');
ALTER TABLE "public"."SOP" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."SOP" ALTER COLUMN "status" TYPE "public"."SOPStatus_new" USING ("status"::text::"public"."SOPStatus_new");
ALTER TYPE "public"."SOPStatus" RENAME TO "SOPStatus_old";
ALTER TYPE "public"."SOPStatus_new" RENAME TO "SOPStatus";
DROP TYPE "public"."SOPStatus_old";
ALTER TABLE "public"."SOP" ALTER COLUMN "status" SET DEFAULT 'Procedure';
COMMIT;

-- AlterTable
ALTER TABLE "public"."SOP" ALTER COLUMN "status" SET DEFAULT 'Procedure';
