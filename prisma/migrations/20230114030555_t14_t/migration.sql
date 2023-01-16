-- AlterTable
ALTER TABLE `declarationsinistre` ADD COLUMN `DOMMAGES_SAISIE8_LIBRE` TEXT NULL;

-- AlterTable
ALTER TABLE `sinistre` ALTER COLUMN `updatedAt` DROP DEFAULT;
