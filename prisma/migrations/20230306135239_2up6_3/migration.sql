/*
  Warnings:

  - You are about to drop the column `regionID` on the `societe` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Societe_regionID_key` ON `societe`;

-- AlterTable
ALTER TABLE `societe` DROP COLUMN `regionID`;
