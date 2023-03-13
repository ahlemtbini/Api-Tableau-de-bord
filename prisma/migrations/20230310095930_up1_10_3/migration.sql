/*
  Warnings:

  - You are about to drop the column `region` on the `societe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `societe` DROP COLUMN `region`,
    ADD COLUMN `cientId` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `countryId` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `regionId` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Societe` ADD CONSTRAINT `Societe_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `Region`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Societe` ADD CONSTRAINT `Societe_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Societe` ADD CONSTRAINT `Societe_cientId_fkey` FOREIGN KEY (`cientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
