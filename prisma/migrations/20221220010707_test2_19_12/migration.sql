/*
  Warnings:

  - You are about to alter the column `Mt Dom.` on the `declarationsinistre` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `coût expert` on the `declarationsinistre` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `Charge Provisionnelle Solaris` on the `declarationsinistre` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `Charge ajustée` on the `declarationsinistre` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `Charge réelle` on the `declarationsinistre` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- DropIndex
DROP INDEX `DeclarationSinistre_Dossier Client_key` ON `declarationsinistre`;

-- AlterTable
ALTER TABLE `declarationsinistre` MODIFY `Dossier Client` VARCHAR(191) NULL,
    MODIFY `Mt Dom.` VARCHAR(191) NULL,
    MODIFY `coût expert` VARCHAR(191) NULL,
    MODIFY `Charge Provisionnelle Solaris` VARCHAR(191) NULL,
    MODIFY `Charge ajustée` VARCHAR(191) NULL,
    MODIFY `Charge réelle` VARCHAR(191) NULL;
