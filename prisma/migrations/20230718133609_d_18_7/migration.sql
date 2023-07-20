-- AlterTable
ALTER TABLE `dashbordprefrences` ADD COLUMN `page2` JSON NULL;

-- CreateTable
CREATE TABLE `Objectif` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `contratId` INTEGER NOT NULL,
    `ClientID` INTEGER NULL,
    `SocieteID` INTEGER NULL,
    `regionId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Objectif` ADD CONSTRAINT `Objectif_ClientID_fkey` FOREIGN KEY (`ClientID`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objectif` ADD CONSTRAINT `Objectif_SocieteID_fkey` FOREIGN KEY (`SocieteID`) REFERENCES `Societe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objectif` ADD CONSTRAINT `Objectif_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `Region`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
