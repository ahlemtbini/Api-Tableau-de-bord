/*
  Warnings:

  - You are about to drop the column `Contrat` on the `entretienpostaccident` table. All the data in the column will be lost.
  - You are about to drop the column `Entite` on the `entretienpostaccident` table. All the data in the column will be lost.
  - You are about to drop the column `Gestion_de_la_mission` on the `entretienpostaccident` table. All the data in the column will be lost.
  - You are about to drop the column `Kilometres_parcourus_avant_le_sinistre` on the `entretienpostaccident` table. All the data in the column will be lost.
  - You are about to drop the column `Vehicule_habituel` on the `entretienpostaccident` table. All the data in the column will be lost.
  - You are about to drop the column `chauffeurID` on the `entretienpostaccident` table. All the data in the column will be lost.
  - You are about to drop the column `declare_a_assureur` on the `entretienpostaccident` table. All the data in the column will be lost.
  - You are about to drop the column `ifacteur_nfluence_survenance_accident` on the `entretienpostaccident` table. All the data in the column will be lost.
  - You are about to drop the column `type_de_vehicule` on the `entretienpostaccident` table. All the data in the column will be lost.
  - You are about to alter the column `jour_de_survenance_de_accident` on the `entretienpostaccident` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(10))` to `VarChar(191)`.
  - You are about to alter the column `Dernier_jour_de_pause_hebdomadaire` on the `entretienpostaccident` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(11))` to `VarChar(191)`.
  - You are about to alter the column `Heure_accident` on the `entretienpostaccident` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(12))` to `VarChar(191)`.
  - You are about to alter the column `Heure_prise_service` on the `entretienpostaccident` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(13))` to `VarChar(191)`.
  - You are about to alter the column `temps_coduite_depuis_prise_servise_au_dernier_pause_obligatoire` on the `entretienpostaccident` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(14))` to `VarChar(191)`.
  - You are about to alter the column `Avis_Evitable_O_N` on the `entretienpostaccident` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to alter the column `Signature_responsable` on the `entretienpostaccident` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `Signature_Conducteur` on the `entretienpostaccident` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `permisConduire` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - Added the required column `client` to the `Chauffeur` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `AdminClient_clientID_fkey` ON `adminclient`;

-- DropIndex
DROP INDEX `Chauffeur_siteId_fkey` ON `chauffeur`;

-- DropIndex
DROP INDEX `Client_superAdminID_fkey` ON `client`;

-- DropIndex
DROP INDEX `Contrat_ClientID_fkey` ON `contrat`;

-- DropIndex
DROP INDEX `Country_clientId_fkey` ON `country`;

-- DropIndex
DROP INDEX `EntretienPostAccident_chauffeurID_fkey` ON `entretienpostaccident`;

-- DropIndex
DROP INDEX `EntretienVehicule_chauffeurID_fkey` ON `entretienvehicule`;

-- DropIndex
DROP INDEX `Manager_clientId_fkey` ON `manager`;

-- DropIndex
DROP INDEX `Objectif_ClientID_fkey` ON `objectif`;

-- DropIndex
DROP INDEX `Objectif_SocieteID_fkey` ON `objectif`;

-- DropIndex
DROP INDEX `Objectif_regionId_fkey` ON `objectif`;

-- DropIndex
DROP INDEX `Objectif_siteId_fkey` ON `objectif`;

-- DropIndex
DROP INDEX `Region_countryID_fkey` ON `region`;

-- DropIndex
DROP INDEX `Sinistre_chauffeurEmail_fkey` ON `sinistre`;

-- DropIndex
DROP INDEX `Site_SocieteID_fkey` ON `site`;

-- DropIndex
DROP INDEX `Societe_clientId_fkey` ON `societe`;

-- DropIndex
DROP INDEX `Societe_contratId_fkey` ON `societe`;

-- DropIndex
DROP INDEX `Societe_countryId_fkey` ON `societe`;

-- DropIndex
DROP INDEX `Societe_regionId_fkey` ON `societe`;

-- DropIndex
DROP INDEX `SocieteManager_managerId_fkey` ON `societemanager`;

-- DropIndex
DROP INDEX `SocieteManager_societeId_fkey` ON `societemanager`;

-- AlterTable
ALTER TABLE `chauffeur` ADD COLUMN `client` VARCHAR(191) NOT NULL,
    ADD COLUMN `societe` VARCHAR(191) NULL,
    MODIFY `siteName` VARCHAR(191) NULL,
    MODIFY `region` VARCHAR(191) NULL,
    MODIFY `siteId` INTEGER NULL;

-- AlterTable
ALTER TABLE `entretienpostaccident` DROP COLUMN `Contrat`,
    DROP COLUMN `Entite`,
    DROP COLUMN `Gestion_de_la_mission`,
    DROP COLUMN `Kilometres_parcourus_avant_le_sinistre`,
    DROP COLUMN `Vehicule_habituel`,
    DROP COLUMN `chauffeurID`,
    DROP COLUMN `declare_a_assureur`,
    DROP COLUMN `ifacteur_nfluence_survenance_accident`,
    DROP COLUMN `type_de_vehicule`,
    ADD COLUMN `Circonstance_de_accident_expression_libre` TEXT NULL,
    ADD COLUMN `Evitabilite_de_accident_expression_libre` TEXT NULL,
    ADD COLUMN `Suggestion_limitation_de_risque` TEXT NULL,
    ADD COLUMN `circonstance_trajet` VARCHAR(191) NULL,
    ADD COLUMN `clientId` INTEGER NULL,
    ADD COLUMN `comment_sentiez_vous` VARCHAR(191) NULL,
    ADD COLUMN `contrat` ENUM('CDI', 'CDD', 'Interimaire', 'Stagiaire') NULL,
    ADD COLUMN `derniere_formation_date` VARCHAR(191) NULL,
    ADD COLUMN `distraction` VARCHAR(191) NULL,
    ADD COLUMN `dossier_sinistre` INTEGER NULL,
    ADD COLUMN `dotation_de_vehicule` VARCHAR(191) NULL,
    ADD COLUMN `estimation_cout` VARCHAR(191) NULL,
    ADD COLUMN `etat_chargemen_vehicule` VARCHAR(191) NULL,
    ADD COLUMN `formation_conduire_vhicule` VARCHAR(191) NULL,
    ADD COLUMN `kilometres_parcourus_avant_le_sinistre` VARCHAR(191) NULL,
    ADD COLUMN `matiere_dangereuse` VARCHAR(191) NULL,
    ADD COLUMN `non_dire_pourquoi` TEXT NULL,
    ADD COLUMN `prise_en_main_accompagne` VARCHAR(191) NULL,
    ADD COLUMN `region` VARCHAR(191) NULL,
    ADD COLUMN `site` VARCHAR(191) NULL,
    ADD COLUMN `situation_de_survenance_conducteur` TEXT NULL,
    ADD COLUMN `situation_de_survenance_tiers` TEXT NULL,
    ADD COLUMN `vehicule_adapte_au_mission` VARCHAR(191) NULL,
    ADD COLUMN `vehicule_deja_conduit` VARCHAR(191) NULL,
    ADD COLUMN `vehicule_habituel` VARCHAR(191) NULL,
    ADD COLUMN `vehicule_inf_35` VARCHAR(191) NULL,
    ADD COLUMN `vehicule_sup_35` VARCHAR(191) NULL,
    MODIFY `societe` VARCHAR(191) NULL,
    MODIFY `nom_prenom_chauffeur` VARCHAR(191) NULL,
    MODIFY `date_entree_dans_fonction` VARCHAR(191) NULL,
    MODIFY `date_accident` VARCHAR(191) NULL,
    MODIFY `date_entretien` VARCHAR(191) NULL,
    MODIFY `entretien_realisee_par` VARCHAR(191) NULL,
    MODIFY `jour_de_survenance_de_accident` VARCHAR(191) NULL,
    MODIFY `Dernier_jour_de_pause_hebdomadaire` VARCHAR(191) NULL,
    MODIFY `Heure_accident` VARCHAR(191) NULL,
    MODIFY `Heure_prise_service` VARCHAR(191) NULL,
    MODIFY `temps_coduite_depuis_prise_servise_au_dernier_pause_obligatoire` VARCHAR(191) NULL,
    MODIFY `meteo` VARCHAR(191) NULL,
    MODIFY `luminosite` VARCHAR(191) NULL,
    MODIFY `environement` VARCHAR(191) NULL,
    MODIFY `configuration` VARCHAR(191) NULL,
    MODIFY `type_de_voie` VARCHAR(191) NULL,
    MODIFY `type_de_tiers` VARCHAR(191) NULL,
    MODIFY `type_de_trajet` VARCHAR(191) NULL,
    MODIFY `Estimation_de_accident` VARCHAR(191) NULL,
    MODIFY `Genre_du_sinistre` VARCHAR(191) NULL,
    MODIFY `Degats` VARCHAR(191) NULL,
    MODIFY `endroit_impact` VARCHAR(191) NULL,
    MODIFY `Expression_libre` TEXT NULL,
    MODIFY `Circonstance_de_accident` TEXT NULL,
    MODIFY `Evitabilite_de_accident` TEXT NULL,
    MODIFY `Avis_Evitable_O_N` VARCHAR(191) NULL,
    MODIFY `Signature_responsable` VARCHAR(191) NULL,
    MODIFY `Signature_Conducteur` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `profile` MODIFY `date_de_naissance` VARCHAR(191) NULL,
    MODIFY `dateEmbauche` VARCHAR(191) NULL,
    MODIFY `permisConduire` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `site` MODIFY `nbrChauffeur` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `societemanager` MODIFY `managerId` INTEGER NULL,
    MODIFY `societeId` INTEGER NULL;

-- CreateTable
CREATE TABLE `apiAdmin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NULL,
    `prenom` VARCHAR(191) NULL,
    `mdp` VARCHAR(191) NULL DEFAULT 'default',
    `role` VARCHAR(191) NOT NULL,
    `resetLink` TEXT NULL,
    `aciveInactive` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `apiAdmin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DashbordPrefrences` ADD CONSTRAINT `DashbordPrefrences_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuperAdmin` ADD CONSTRAINT `SuperAdmin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminClient` ADD CONSTRAINT `AdminClient_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminClient` ADD CONSTRAINT `AdminClient_clientID_fkey` FOREIGN KEY (`clientID`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Manager` ADD CONSTRAINT `Manager_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Manager` ADD CONSTRAINT `Manager_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chauffeur` ADD CONSTRAINT `Chauffeur_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chauffeur` ADD CONSTRAINT `Chauffeur_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `Site`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objectif` ADD CONSTRAINT `Objectif_ClientID_fkey` FOREIGN KEY (`ClientID`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objectif` ADD CONSTRAINT `Objectif_SocieteID_fkey` FOREIGN KEY (`SocieteID`) REFERENCES `Societe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objectif` ADD CONSTRAINT `Objectif_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `Region`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objectif` ADD CONSTRAINT `Objectif_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `Site`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_superAdminID_fkey` FOREIGN KEY (`superAdminID`) REFERENCES `SuperAdmin`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contrat` ADD CONSTRAINT `Contrat_ClientID_fkey` FOREIGN KEY (`ClientID`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Country` ADD CONSTRAINT `Country_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Region` ADD CONSTRAINT `Region_countryID_fkey` FOREIGN KEY (`countryID`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Societe` ADD CONSTRAINT `Societe_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `Region`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Societe` ADD CONSTRAINT `Societe_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Societe` ADD CONSTRAINT `Societe_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Societe` ADD CONSTRAINT `Societe_contratId_fkey` FOREIGN KEY (`contratId`) REFERENCES `Contrat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SocieteManager` ADD CONSTRAINT `SocieteManager_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Manager`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SocieteManager` ADD CONSTRAINT `SocieteManager_societeId_fkey` FOREIGN KEY (`societeId`) REFERENCES `Societe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Site` ADD CONSTRAINT `Site_SocieteID_fkey` FOREIGN KEY (`SocieteID`) REFERENCES `Societe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sinistre` ADD CONSTRAINT `Sinistre_chauffeurEmail_fkey` FOREIGN KEY (`chauffeurEmail`) REFERENCES `Chauffeur`(`email`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeclarationSinistre` ADD CONSTRAINT `DeclarationSinistre_DOSSIER_fkey` FOREIGN KEY (`DOSSIER`) REFERENCES `Sinistre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntretienVehicule` ADD CONSTRAINT `EntretienVehicule_chauffeurID_fkey` FOREIGN KEY (`chauffeurID`) REFERENCES `Chauffeur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
