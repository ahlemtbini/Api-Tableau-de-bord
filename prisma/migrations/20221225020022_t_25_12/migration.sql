-- DropForeignKey
ALTER TABLE `contrat` DROP FOREIGN KEY `Contrat_ClientID_fkey`;

-- AlterTable
ALTER TABLE `client` MODIFY `numAssistance` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Contrat` ADD CONSTRAINT `Contrat_ClientID_fkey` FOREIGN KEY (`ClientID`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
