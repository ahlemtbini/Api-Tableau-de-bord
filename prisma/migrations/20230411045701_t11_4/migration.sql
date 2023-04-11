/*
  Warnings:

  - You are about to alter the column `carte_grise` on the `sinistre` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `constat` on the `sinistre` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `declaration_chauffeur` on the `sinistre` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `permis_conduire` on the `sinistre` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- DropIndex
DROP INDEX `Contrat_SocieteID_fkey` ON `contrat`;

-- AlterTable
ALTER TABLE `sinistre` ADD COLUMN `autres_pieces` JSON NULL,
    MODIFY `carte_grise` JSON NULL,
    MODIFY `constat` JSON NULL,
    MODIFY `declaration_chauffeur` JSON NULL,
    MODIFY `permis_conduire` JSON NULL;
