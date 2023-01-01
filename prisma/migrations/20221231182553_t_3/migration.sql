/*
  Warnings:

  - You are about to alter the column `NATURE` on the `declarationsinistre` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(16))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `declarationsinistre` MODIFY `NATURE` VARCHAR(191) NULL;
