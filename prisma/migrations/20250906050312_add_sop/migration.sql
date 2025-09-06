-- CreateTable
CREATE TABLE "public"."SOP" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "jurisdiction" TEXT[],
    "tags" TEXT[],
    "protocol_stpes" TEXT NOT NULL,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SOP_pkey" PRIMARY KEY ("id")
);
