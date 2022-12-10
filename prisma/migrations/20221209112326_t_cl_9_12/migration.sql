/*
  Warnings:

  - You are about to alter the column `logo` on the `client` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `client` MODIFY `logo` VARCHAR(191) NULL;
