-- AlterTable
ALTER TABLE "credentials" ADD COLUMN     "login_method" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
