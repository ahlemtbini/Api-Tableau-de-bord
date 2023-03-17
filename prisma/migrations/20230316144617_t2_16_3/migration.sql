-- DropForeignKey
ALTER TABLE `region` DROP FOREIGN KEY `Region_countryID_fkey`;

-- AddForeignKey
ALTER TABLE `Region` ADD CONSTRAINT `Region_countryID_fkey` FOREIGN KEY (`countryID`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
