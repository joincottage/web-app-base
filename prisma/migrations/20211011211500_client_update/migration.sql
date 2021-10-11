/*
  Warnings:

  - You are about to drop the column `userIdOfOwner` on the `Client` table. All the data in the column will be lost.
  - Added the required column `userEmailOfOwner` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Client` DROP COLUMN `userIdOfOwner`,
    ADD COLUMN `userEmailOfOwner` VARCHAR(191) NOT NULL;
