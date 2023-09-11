/*
  Warnings:

  - The values [execute] on the enum `CommandType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CommandType_new" AS ENUM ('audio', 'say');
ALTER TABLE "ChatBotCommand" ALTER COLUMN "type" TYPE "CommandType_new" USING ("type"::text::"CommandType_new");
ALTER TYPE "CommandType" RENAME TO "CommandType_old";
ALTER TYPE "CommandType_new" RENAME TO "CommandType";
DROP TYPE "CommandType_old";
COMMIT;
