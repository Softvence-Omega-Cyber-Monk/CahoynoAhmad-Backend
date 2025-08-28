-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'TRAINE');

-- CreateTable
CREATE TABLE "public"."credentials" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resetToken" TEXT,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credentials_email_key" ON "public"."credentials"("email");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_phone_key" ON "public"."credentials"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_lastName_key" ON "public"."credentials"("lastName");
