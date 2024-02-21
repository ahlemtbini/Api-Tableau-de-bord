/*
  Warnings:

  - Added the required column `value` to the `Objectif` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `objectif` ADD COLUMN `value` VARCHAR(191) NOT NULL,
    MODIFY `year` VARCHAR(191) NOT NULL,
    MODIFY `contratId` INTEGER NULL;
