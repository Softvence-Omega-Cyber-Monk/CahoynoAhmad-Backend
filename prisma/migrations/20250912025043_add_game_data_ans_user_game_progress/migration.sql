-- CreateTable
CREATE TABLE "public"."GameData" (
    "id" TEXT NOT NULL,
    "surahId" TEXT,
    "ayahId" TEXT,
    "arabicText" TEXT,
    "englishText" TEXT,
    "audioUrl" TEXT,
    "correct" TEXT NOT NULL,
    "options" TEXT[],

    CONSTRAINT "GameData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserGameProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "surahId" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserGameProgress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UserGameProgress" ADD CONSTRAINT "UserGameProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."credentials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
