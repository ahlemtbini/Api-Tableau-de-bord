-- DropForeignKey
ALTER TABLE `societe` DROP FOREIGN KEY `Societe_cientId_fkey`;

-- DropForeignKey
ALTER TABLE `societe` DROP FOREIGN KEY `Societe_countryId_fkey`;

-- DropForeignKey
ALTER TABLE `societe` DROP FOREIGN KEY `Societe_regionId_fkey`;

-- AddForeignKey
ALTER TABLE `Societe` ADD CONSTRAINT `Societe_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `Region`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Societe` ADD CONSTRAINT `Societe_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Societe` ADD CONSTRAINT `Societe_cientId_fkey` FOREIGN KEY (`cientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
