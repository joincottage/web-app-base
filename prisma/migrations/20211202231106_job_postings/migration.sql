-- CreateTable
CREATE TABLE `JobPost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `jobName` VARCHAR(191) NOT NULL,
    `jobPostUrl` VARCHAR(191),
    `price` VARCHAR(191),
    `timeCommitment` VARCHAR(191),
    `companyLogoUrl` VARCHAR(191),
    `companyName` VARCHAR(191) NOT NULL,
    `sourceName` VARCHAR(191),
    `sourceUrl` VARCHAR(191),
    `sourceLogoUrl` VARCHAR(191),
    `createdBy` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
