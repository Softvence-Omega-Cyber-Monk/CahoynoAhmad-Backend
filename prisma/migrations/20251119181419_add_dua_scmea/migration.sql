-- CreateTable
CREATE TABLE "Dua" (
    "id" SERIAL NOT NULL,
    "duaDisplayName" TEXT,
    "duaReletionName" TEXT NOT NULL,
    "measing" TEXT,

    CONSTRAINT "Dua_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dua_duaReletionName_key" ON "Dua"("duaReletionName");
