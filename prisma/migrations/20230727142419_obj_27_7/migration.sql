/*
  Warnings:

  - A unique constraint covering the columns `[year]` on the table `Objectif` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `objectif` ADD COLUMN `SiteId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Objectif_year_key` ON `Objectif`(`year`);

-- AddForeignKey
ALTER TABLE `Objectif` ADD CONSTRAINT `Objectif_SiteId_fkey` FOREIGN KEY (`SiteId`) REFERENCES `Site`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
