/*
  Warnings:

  - Made the column `clientId` on table `manager` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `country` DROP FOREIGN KEY `Country_clientId_fkey`;

-- AlterTable
ALTER TABLE `manager` MODIFY `clientId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Manager` ADD CONSTRAINT `Manager_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Country` ADD CONSTRAINT `Country_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
