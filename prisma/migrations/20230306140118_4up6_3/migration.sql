-- AlterTable
ALTER TABLE `societe` MODIFY `numTel` VARCHAR(191) NULL,
    MODIFY `numSiret` VARCHAR(191) NULL,
    MODIFY `isActive` BOOLEAN NOT NULL DEFAULT true;
