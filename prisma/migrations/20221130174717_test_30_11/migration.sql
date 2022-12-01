-- DropIndex
DROP INDEX `Client_superAdminID_fkey` ON `client`;

-- DropIndex
DROP INDEX `Country_clientId_fkey` ON `country`;

-- DropIndex
DROP INDEX `EntretienPostAccident_chauffeurID_fkey` ON `entretienpostaccident`;

-- DropIndex
DROP INDEX `EntretienVehicule_chauffeurID_fkey` ON `entretienvehicule`;

-- DropIndex
DROP INDEX `Region_countryID_fkey` ON `region`;

-- DropIndex
DROP INDEX `Sinistre_chauffeurID_fkey` ON `sinistre`;

-- AlterTable
ALTER TABLE `client` MODIFY `numAssistance` INTEGER NULL,
    MODIFY `descriptifAssistance` VARCHAR(1000) NULL,
    MODIFY `nbreSites` INTEGER NULL DEFAULT 0,
    MODIFY `nbreAdmins` INTEGER NULL DEFAULT 0,
    MODIFY `startDate` DATETIME(3) NULL,
    MODIFY `endDate` DATETIME(3) NULL,
    MODIFY `updatedAt` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuperAdmin` ADD CONSTRAINT `SuperAdmin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminClient` ADD CONSTRAINT `AdminClient_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminClient` ADD CONSTRAINT `AdminClient_clientID_fkey` FOREIGN KEY (`clientID`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Manager` ADD CONSTRAINT `Manager_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chauffeur` ADD CONSTRAINT `Chauffeur_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chauffeur` ADD CONSTRAINT `Chauffeur_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `Site`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_superAdminID_fkey` FOREIGN KEY (`superAdminID`) REFERENCES `SuperAdmin`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Country` ADD CONSTRAINT `Country_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Region` ADD CONSTRAINT `Region_countryID_fkey` FOREIGN KEY (`countryID`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Societe` ADD CONSTRAINT `Societe_regionID_fkey` FOREIGN KEY (`regionID`) REFERENCES `Region`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Site` ADD CONSTRAINT `Site_companyID_fkey` FOREIGN KEY (`companyID`) REFERENCES `Societe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sinistre` ADD CONSTRAINT `Sinistre_chauffeurID_fkey` FOREIGN KEY (`chauffeurID`) REFERENCES `Chauffeur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntretienPostAccident` ADD CONSTRAINT `EntretienPostAccident_chauffeurID_fkey` FOREIGN KEY (`chauffeurID`) REFERENCES `Chauffeur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntretienVehicule` ADD CONSTRAINT `EntretienVehicule_chauffeurID_fkey` FOREIGN KEY (`chauffeurID`) REFERENCES `Chauffeur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeclarationSinistre` ADD CONSTRAINT `DeclarationSinistre_sinistreId_fkey` FOREIGN KEY (`sinistreId`) REFERENCES `Sinistre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ManagerToSociete` ADD CONSTRAINT `_ManagerToSociete_A_fkey` FOREIGN KEY (`A`) REFERENCES `Manager`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ManagerToSociete` ADD CONSTRAINT `_ManagerToSociete_B_fkey` FOREIGN KEY (`B`) REFERENCES `Societe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
