/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `phone`,
    ADD COLUMN `bio` VARCHAR(191),
    ADD COLUMN `img_url` VARCHAR(191),
    MODIFY `name` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Profile`;
