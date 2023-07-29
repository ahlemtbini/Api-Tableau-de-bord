/*
  Warnings:

  - You are about to drop the column `SiteId` on the `objectif` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `objectif` DROP FOREIGN KEY `Objectif_SiteId_fkey`;

-- DropIndex
DROP INDEX `Objectif_year_key` ON `objectif`;

-- AlterTable
ALTER TABLE `objectif` DROP COLUMN `SiteId`,
    ADD COLUMN `siteId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Objectif` ADD CONSTRAINT `Objectif_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `Site`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
