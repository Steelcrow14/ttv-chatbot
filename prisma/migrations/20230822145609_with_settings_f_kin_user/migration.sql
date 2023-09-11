/*
  Warnings:

  - You are about to drop the column `userId` on the `Settings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[settingsId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_userId_fkey";

-- DropIndex
DROP INDEX "Settings_channel_key";

-- DropIndex
DROP INDEX "Settings_userId_key";

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "settingsId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_settingsId_key" ON "User"("settingsId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "Settings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
