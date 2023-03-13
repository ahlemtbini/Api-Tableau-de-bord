/*
  Warnings:

  - You are about to drop the column `cientId` on the `societe` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `Societe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `societe` DROP FOREIGN KEY `Societe_cientId_fkey`;

-- AlterTable
ALTER TABLE `societe` DROP COLUMN `cientId`,
    ADD COLUMN `clientId` INTEGER NOT NULL,
    ALTER COLUMN `countryId` DROP DEFAULT,
    ALTER COLUMN `regionId` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `Societe` ADD CONSTRAINT `Societe_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
