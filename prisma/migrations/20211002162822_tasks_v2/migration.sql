/*
  Warnings:

  - You are about to drop the column `desc` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `img_url` on the `Task` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Task.email_unique` ON `Task`;

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `desc`,
    DROP COLUMN `email`,
    DROP COLUMN `img_url`,
    ADD COLUMN `clientImgUrl` VARCHAR(191),
    ADD COLUMN `clientName` VARCHAR(191),
    ADD COLUMN `longDesc` VARCHAR(191),
    ADD COLUMN `shortDesc` VARCHAR(191);
