-- DropForeignKey
ALTER TABLE `contrat` DROP FOREIGN KEY `Contrat_SocieteID_fkey`;

-- AlterTable
ALTER TABLE `societe` ADD COLUMN `contratId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Societe` ADD CONSTRAINT `Societe_contratId_fkey` FOREIGN KEY (`contratId`) REFERENCES `Contrat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
