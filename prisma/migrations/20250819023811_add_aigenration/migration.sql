-- CreateTable
CREATE TABLE "public"."ai_generations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userPlan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tone" TEXT,
    "textLength" INTEGER,

    CONSTRAINT "ai_generations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_generations_userId_createdAt_idx" ON "public"."ai_generations"("userId", "createdAt");
