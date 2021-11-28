/*
  Warnings:

  - You are about to alter the column `userId` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `clientId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Task` ADD COLUMN `clientId` INTEGER NOT NULL,
    MODIFY `userId` INTEGER;
