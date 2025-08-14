-- CreateTable
CREATE TABLE "public"."webSubscribedUsers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "webSubscribedUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "webSubscribedUsers_userId_key" ON "public"."webSubscribedUsers"("userId");

-- AddForeignKey
ALTER TABLE "public"."webSubscribedUsers" ADD CONSTRAINT "webSubscribedUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."credentials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
