/*
  Warnings:

  - Added the required column `region` to the `Societe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `societe` DROP FOREIGN KEY `Societe_regionID_fkey`;

-- AlterTable
ALTER TABLE `societe` ADD COLUMN `region` VARCHAR(191) NOT NULL;
