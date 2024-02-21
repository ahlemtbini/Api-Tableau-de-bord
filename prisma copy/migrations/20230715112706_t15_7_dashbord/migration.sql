-- CreateTable
CREATE TABLE `DashbordPrefrences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `page1` JSON NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `DashbordPrefrences_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DashbordPrefrences` ADD CONSTRAINT `DashbordPrefrences_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
