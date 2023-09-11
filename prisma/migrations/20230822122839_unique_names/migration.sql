/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `ChatBotCommand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `UserFile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ChatBotCommand_name_key" ON "ChatBotCommand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserFile_name_key" ON "UserFile"("name");
