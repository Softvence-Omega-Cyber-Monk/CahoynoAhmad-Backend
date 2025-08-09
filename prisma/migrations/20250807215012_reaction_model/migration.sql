-- CreateTable
CREATE TABLE "public"."Reaction" (
    "id" TEXT NOT NULL,
    "haha" INTEGER NOT NULL DEFAULT 0,
    "angry" INTEGER NOT NULL DEFAULT 0,
    "care" INTEGER NOT NULL DEFAULT 0,
    "love" INTEGER NOT NULL DEFAULT 0,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Reaction" ADD CONSTRAINT "Reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."credentials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
