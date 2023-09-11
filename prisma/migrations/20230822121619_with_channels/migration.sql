-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
