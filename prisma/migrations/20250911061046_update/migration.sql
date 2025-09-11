-- CreateTable
CREATE TABLE "public"."User_Stat" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "ayahs_read" INTEGER NOT NULL,
    "minutes_read" INTEGER NOT NULL,
    "quest_complete" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_Stat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Stat_user_id_key" ON "public"."User_Stat"("user_id");

-- AddForeignKey
ALTER TABLE "public"."User_Stat" ADD CONSTRAINT "User_Stat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."credentials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
