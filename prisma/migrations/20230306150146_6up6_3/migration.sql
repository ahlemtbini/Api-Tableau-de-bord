/*
  Warnings:

  - You are about to drop the column `companyID` on the `site` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `site` DROP FOREIGN KEY `Site_companyID_fkey`;

-- AlterTable
ALTER TABLE `site` DROP COLUMN `companyID`,
    ADD COLUMN `SocieteID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Site` ADD CONSTRAINT `Site_SocieteID_fkey` FOREIGN KEY (`SocieteID`) REFERENCES `Societe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
