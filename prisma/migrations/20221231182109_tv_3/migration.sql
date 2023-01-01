/*
  Warnings:

  - You are about to alter the column `Numéro Client` on the `declarationsinistre` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `declarationsinistre` MODIFY `Numéro Client` INTEGER NULL;
