/*
  Warnings:

  - A unique constraint covering the columns `[authId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `authId` INTEGER NOT NULL,
    MODIFY `name` VARCHAR(191);

-- CreateIndex
CREATE UNIQUE INDEX `User.authId_unique` ON `User`(`authId`);
