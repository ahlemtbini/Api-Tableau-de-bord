/*
  Warnings:

  - Made the column `createdAt` on table `sinistre` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `sinistre` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` ADD COLUMN `resetLink` VARCHAR(191) NOT NULL DEFAULT '';
