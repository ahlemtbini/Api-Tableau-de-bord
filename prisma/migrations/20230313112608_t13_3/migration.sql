-- DropForeignKey
ALTER TABLE `societemanager` DROP FOREIGN KEY `SocieteManager_managerId_fkey`;

-- DropForeignKey
ALTER TABLE `societemanager` DROP FOREIGN KEY `SocieteManager_societeId_fkey`;

-- AddForeignKey
ALTER TABLE `SocieteManager` ADD CONSTRAINT `SocieteManager_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Manager`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SocieteManager` ADD CONSTRAINT `SocieteManager_societeId_fkey` FOREIGN KEY (`societeId`) REFERENCES `Societe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
