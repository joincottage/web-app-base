-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `auth_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `img_url` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `skills` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `hasJoinedDiscord` BOOLEAN NULL,
    `stripeAccountId` VARCHAR(191) NULL,
    `stripeCustomerId` VARCHAR(191) NULL,
    `clientId` INTEGER NULL,

    UNIQUE INDEX `User_auth_id_key`(`auth_id`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `clientName` VARCHAR(191) NULL,
    `clientImgUrl` VARCHAR(191) NULL,
    `clientCategoryId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `shortDesc` VARCHAR(191) NULL,
    `longDesc` VARCHAR(5000) NULL,
    `type` VARCHAR(191) NULL,
    `skills` VARCHAR(191) NULL,
    `datePosted` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `price` INTEGER NULL,
    `userId` INTEGER NULL,
    `clientId` INTEGER NOT NULL,
    `userImgUrl` VARCHAR(191) NULL,
    `discordChannelId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NULL,
    `logoUrl` VARCHAR(191) NULL,
    `userEmailOfOwner` VARCHAR(191) NOT NULL,
    `discordCategoryId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobPost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `jobName` VARCHAR(191) NOT NULL,
    `jobPostUrl` VARCHAR(191) NULL,
    `price` VARCHAR(191) NULL,
    `timeCommitment` VARCHAR(191) NULL,
    `companyLogoUrl` VARCHAR(191) NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `sourceName` VARCHAR(191) NULL,
    `sourceUrl` VARCHAR(191) NULL,
    `sourceLogoUrl` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
