/*
  Warnings:

  - You are about to alter the column `CESSION_EPAVE` on the `declarationsinistre` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(14))` to `VarChar(191)`.
  - You are about to alter the column `CONSTAT_ORIGINAL` on the `declarationsinistre` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(15))` to `VarChar(191)`.
  - You are about to alter the column `CONVENTION` on the `declarationsinistre` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(16))` to `VarChar(191)`.
  - You are about to alter the column `PERTE_FI` on the `declarationsinistre` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(17))` to `VarChar(191)`.
  - You are about to alter the column `PIECES_MANQUANTES` on the `declarationsinistre` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(18))` to `VarChar(191)`.
  - You are about to alter the column `REPARATION` on the `declarationsinistre` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(19))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `declarationsinistre` MODIFY `CESSION_EPAVE` VARCHAR(191) NULL,
    MODIFY `CONSTAT_ORIGINAL` VARCHAR(191) NULL,
    MODIFY `CONVENTION` VARCHAR(191) NULL,
    MODIFY `PERTE_FI` VARCHAR(191) NULL,
    MODIFY `PIECES_MANQUANTES` VARCHAR(191) NULL,
    MODIFY `REPARATION` VARCHAR(191) NULL;
