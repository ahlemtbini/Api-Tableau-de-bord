-- DropForeignKey
ALTER TABLE `site` DROP FOREIGN KEY `Site_companyID_fkey`;

-- AlterTable
ALTER TABLE `societe` MODIFY `region` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Site` ADD CONSTRAINT `Site_companyID_fkey` FOREIGN KEY (`companyID`) REFERENCES `Societe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
