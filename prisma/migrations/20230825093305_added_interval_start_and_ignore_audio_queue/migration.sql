-- CreateEnum
CREATE TYPE "IntervalStart" AS ENUM ('onConnect', 'onDayStart');

-- AlterTable
ALTER TABLE "ChatBotCommand" ADD COLUMN     "ignoreAudioQueue" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "intervalStart" "IntervalStart" NOT NULL DEFAULT 'onConnect';
