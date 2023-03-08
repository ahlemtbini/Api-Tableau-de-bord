-- DropForeignKey
ALTER TABLE `contrat` DROP FOREIGN KEY `Contrat_SocieteID_fkey`;

-- DropForeignKey
ALTER TABLE `manager` DROP FOREIGN KEY `Manager_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Manager` ADD CONSTRAINT `Manager_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contrat` ADD CONSTRAINT `Contrat_SocieteID_fkey` FOREIGN KEY (`SocieteID`) REFERENCES `Societe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
