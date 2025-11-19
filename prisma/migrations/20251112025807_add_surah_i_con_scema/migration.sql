-- CreateTable
CREATE TABLE "surahIcon" (
    "id" TEXT NOT NULL,
    "surahNumber" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surahIcon_pkey" PRIMARY KEY ("id")
);
