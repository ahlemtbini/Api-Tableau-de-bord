/*
  Warnings:

  - You are about to drop the `_managertosociete` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_managertosociete` DROP FOREIGN KEY `_ManagerToSociete_A_fkey`;

-- DropForeignKey
ALTER TABLE `_managertosociete` DROP FOREIGN KEY `_ManagerToSociete_B_fkey`;

-- AlterTable
ALTER TABLE `manager` ADD COLUMN `clientId` INTEGER NULL;

-- DropTable
DROP TABLE `_managertosociete`;

-- CreateTable
CREATE TABLE `SocieteManager` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `managerId` INTEGER NOT NULL,
    `societeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SocieteManager` ADD CONSTRAINT `SocieteManager_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Manager`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SocieteManager` ADD CONSTRAINT `SocieteManager_societeId_fkey` FOREIGN KEY (`societeId`) REFERENCES `Societe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
