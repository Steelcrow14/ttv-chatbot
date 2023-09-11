/*
  Warnings:

  - You are about to drop the column `intervalStart` on the `ChatBotCommand` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatBotCommand" DROP COLUMN "intervalStart";

-- DropEnum
DROP TYPE "IntervalStart";
