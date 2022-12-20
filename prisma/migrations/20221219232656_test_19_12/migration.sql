-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `mdp` VARCHAR(191) NOT NULL DEFAULT 'default',
    `role` VARCHAR(191) NOT NULL,
    `aciveInactive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numTel` INTEGER NULL,
    `date_de_naissance` DATE NOT NULL,
    `typeContrat` ENUM('CDI', 'CDD', 'Interimaire', 'Stagiaire') NULL,
    `dateEmbauche` DATETIME(3) NULL,
    `creerPar` ENUM('super_admin', 'client_admin', 'manager', 'chauffeur') NOT NULL DEFAULT 'manager',
    `permisConduire` LONGBLOB NULL,
    `picture` LONGBLOB NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Profile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SuperAdmin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `SuperAdmin_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminClient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `clientID` INTEGER NOT NULL,

    UNIQUE INDEX `AdminClient_userId_key`(`userId`),
    UNIQUE INDEX `AdminClient_clientID_key`(`clientID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Manager` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `droits` ENUM('consulter', 'gerer') NOT NULL,

    UNIQUE INDEX `Manager_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chauffeur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `siteName` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `siteId` INTEGER NOT NULL,

    UNIQUE INDEX `Chauffeur_email_key`(`email`),
    UNIQUE INDEX `Chauffeur_userId_key`(`userId`),
    UNIQUE INDEX `Chauffeur_siteId_key`(`siteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomClient` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `numTel` VARCHAR(191) NOT NULL,
    `ville` VARCHAR(191) NULL,
    `code postale` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,
    `numAssistance` INTEGER NULL,
    `descriptifAssistance` VARCHAR(1000) NULL,
    `nomDomaine` VARCHAR(191) NOT NULL,
    `numSiret` VARCHAR(191) NULL,
    `nbreSociete` INTEGER NOT NULL DEFAULT 0,
    `nbreSites` INTEGER NULL DEFAULT 0,
    `nbreAdmins` INTEGER NULL DEFAULT 0,
    `startDate` VARCHAR(191) NULL,
    `endDate` VARCHAR(191) NULL,
    `donneesCrypte` BOOLEAN NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `logo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `superAdminID` INTEGER NOT NULL,

    UNIQUE INDEX `Client_email_key`(`email`),
    UNIQUE INDEX `Client_numTel_key`(`numTel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contrat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `refContrat` VARCHAR(191) NOT NULL,
    `Assureur` VARCHAR(191) NOT NULL,
    `typeContrat` VARCHAR(191) NULL,
    `startDate` VARCHAR(191) NULL,
    `endDate` VARCHAR(191) NULL,
    `ClientID` INTEGER NULL,
    `SocieteID` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Country` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `clientId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Region` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `countryID` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Societe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `numTel` INTEGER NOT NULL,
    `numSiret` INTEGER NULL,
    `nmbreSites` INTEGER NOT NULL DEFAULT 0,
    `creerPar` ENUM('super_admin', 'client_admin', 'manager', 'chauffeur') NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `regionID` INTEGER NOT NULL,

    UNIQUE INDEX `Societe_regionID_key`(`regionID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Site` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `adresse` VARCHAR(191) NOT NULL,
    `nbrChauffeur` INTEGER NOT NULL DEFAULT 0,
    `creerPar` ENUM('super_admin', 'client_admin', 'manager', 'chauffeur') NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `companyID` INTEGER NOT NULL,

    UNIQUE INDEX `Site_companyID_key`(`companyID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sinistre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `etat` ENUM('recu', 'enAttente', 'confirme', 'refuse') NULL DEFAULT 'recu',
    `chauffeurEmail` VARCHAR(191) NULL,
    `créer par` ENUM('super_admin', 'client_admin', 'manager', 'chauffeur') NOT NULL,
    `id créateur` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeclarationSinistre` (
    `Dossier` INTEGER NOT NULL,
    `Dossier Client` VARCHAR(191) NOT NULL,
    `Numéro Client` VARCHAR(191) NULL,
    `Année` INTEGER NULL,
    `ASSUREUR` VARCHAR(191) NULL,
    `Numéro Contrat` VARCHAR(191) NULL,
    `Amiable` VARCHAR(191) NULL,
    `Ref Sinistre Assureur` VARCHAR(191) NULL,
    `Date récep.` VARCHAR(191) NOT NULL,
    `Date Survenance.` VARCHAR(191) NOT NULL,
    `Heure` ENUM('Entre_3h_6h', 'Entre_6h_9h', 'Entre_9h_11h', 'Entre_11h_13h', 'Entre_15h_17h', 'Entre_17h_19h', 'Entre_19h_22h', 'Entre_22h_3h') NULL,
    `CAS` ENUM('Arrêt', 'En Circulation', 'Manœuvre') NULL,
    `LIEU SINISTRE` VARCHAR(191) NOT NULL,
    `SOCIETE` VARCHAR(191) NULL,
    `Site` VARCHAR(191) NULL,
    `Région` VARCHAR(191) NULL,
    `Type Véhicule` ENUM('TRR', 'SR', 'VL', 'Camion') NOT NULL,
    `Immatriculation` VARCHAR(191) NOT NULL,
    `Marque` VARCHAR(191) NULL,
    `1ère MEC` VARCHAR(191) NOT NULL,
    `Perte Fi` ENUM('oui', 'non') NULL,
    `Conducteur` VARCHAR(191) NOT NULL,
    `%RC` INTEGER NULL,
    `Cas IDA` INTEGER NULL,
    `Nature` ENUM('Etranger', 'Corpo', 'Non Auto') NULL,
    `Circonstances` TEXT NULL,
    `Dommages` VARCHAR(191) NULL,
    `Cie adv.` VARCHAR(191) NULL,
    `Conv.` ENUM('oui', 'non') NULL,
    `Mt Dom.` DOUBLE NULL,
    `Franchise` INTEGER NULL,
    `Date MISSIONNEMENT` VARCHAR(191) NULL,
    `Lieu expertise` VARCHAR(191) NULL,
    `Date EXPERTISE` VARCHAR(191) NULL,
    `Date RAPPORT` VARCHAR(191) NULL,
    `Ref expertise` INTEGER NULL,
    `Date RAPPORT DEFINITIF` VARCHAR(191) NULL,
    `coût expert` DOUBLE NULL,
    `REPARATION O/N` ENUM('oui', 'non') NULL,
    `CESSION/EPAVE` ENUM('oui', 'non') NULL,
    `Mt rec.` INTEGER NULL,
    `Pièces manquantes O/N` ENUM('oui', 'non') NULL,
    `Détail pièces manquantes` ENUM('Devis', 'CG', 'Permis', 'Facture', 'Déclaration Chauffeur', 'PV', 'Constat') NULL,
    `Date de relance pièces M` VARCHAR(191) NULL,
    `Constat original O/N` ENUM('oui', 'non') NULL,
    `Date clot.` VARCHAR(191) NULL,
    `Charge Provisionnelle Solaris` DOUBLE NULL,
    `Charge ajustée` DOUBLE NULL,
    `Charge réelle` DOUBLE NULL,
    `Etat` ENUM('En_cours', 'Clos') NULL,
    `Commentaires` TEXT NULL,

    UNIQUE INDEX `DeclarationSinistre_Dossier_key`(`Dossier`),
    UNIQUE INDEX `DeclarationSinistre_Dossier Client_key`(`Dossier Client`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntretienPostAccident` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `societe` VARCHAR(191) NOT NULL,
    `Entite` VARCHAR(191) NOT NULL,
    `nom_prenom_chauffeur` VARCHAR(191) NOT NULL,
    `date_entree_dans_fonction` DATETIME(3) NOT NULL,
    `Contrat` ENUM('CDI', 'CDD', 'Interimaire', 'Stagiaire') NOT NULL,
    `date_accident` DATETIME(3) NOT NULL,
    `declare_a_assureur` ENUM('oui', 'non', 'ne_sais_pas') NOT NULL,
    `date_entretien` DATETIME(3) NOT NULL,
    `entretien_realisee_par` VARCHAR(191) NOT NULL,
    `jour_de_survenance_de_accident` ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche') NOT NULL,
    `Dernier_jour_de_pause_hebdomadaire` ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche') NOT NULL,
    `Heure_accident` ENUM('Entre_3h_6h', 'Entre_6h_9h', 'Entre_9h_11h', 'Entre_11h_13h', 'Entre_15h_17h', 'Entre_17h_19h', 'Entre_19h_22h', 'Entre_22h_3h') NOT NULL,
    `Heure_prise_service` ENUM('Entre_3h_6h', 'Entre_6h_9h', 'Entre_9h_11h', 'Entre_11h_13h', 'Entre_15h_17h', 'Entre_17h_19h', 'Entre_19h_22h', 'Entre_22h_3h') NOT NULL,
    `temps_coduite_depuis_prise_servise_au_dernier_pause_obligatoire` ENUM('Moins_30min', 'Entre_30min_1h', 'Entre_1h_2h', 'Entre_2h_3h', 'Entre_3h_4h', 'plus_4h') NOT NULL,
    `Vehicule_habituel` BOOLEAN NOT NULL,
    `type_de_vehicule` VARCHAR(191) NOT NULL,
    `chauffeurID` INTEGER NOT NULL,
    `meteo` VARCHAR(191) NOT NULL,
    `luminosite` VARCHAR(191) NOT NULL,
    `environement` VARCHAR(191) NOT NULL,
    `configuration` VARCHAR(191) NOT NULL,
    `type_de_voie` VARCHAR(191) NOT NULL,
    `type_de_tiers` VARCHAR(191) NOT NULL,
    `type_de_trajet` VARCHAR(191) NOT NULL,
    `Kilometres_parcourus_avant_le_sinistre` VARCHAR(191) NOT NULL,
    `Gestion_de_la_mission` VARCHAR(191) NOT NULL,
    `Estimation_de_accident` VARCHAR(191) NOT NULL,
    `Genre_du_sinistre` VARCHAR(191) NOT NULL,
    `Degats` VARCHAR(191) NOT NULL,
    `endroit_impact` VARCHAR(191) NOT NULL,
    `Expression_libre` TEXT NOT NULL,
    `Circonstance_de_accident` INTEGER NOT NULL,
    `Evitabilite_de_accident` INTEGER NOT NULL,
    `ifacteur_nfluence_survenance_accident` INTEGER NOT NULL,
    `Avis_Evitable_O_N` BOOLEAN NOT NULL,
    `Signature_responsable` LONGBLOB NOT NULL,
    `Signature_Conducteur` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntretienVehicule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `etat` VARCHAR(191) NOT NULL,
    `resultat_entretien` VARCHAR(191) NOT NULL,
    `description_entretien` TEXT NOT NULL,
    `type_vehicule` VARCHAR(191) NOT NULL,
    `matricule` VARCHAR(191) NOT NULL,
    `chauffeurID` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ManagerToSociete` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ManagerToSociete_AB_unique`(`A`, `B`),
    INDEX `_ManagerToSociete_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `Contrat` ADD CONSTRAINT `Contrat_ClientID_fkey` FOREIGN KEY (`ClientID`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contrat` ADD CONSTRAINT `Contrat_SocieteID_fkey` FOREIGN KEY (`SocieteID`) REFERENCES `Societe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Country` ADD CONSTRAINT `Country_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Region` ADD CONSTRAINT `Region_countryID_fkey` FOREIGN KEY (`countryID`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Societe` ADD CONSTRAINT `Societe_regionID_fkey` FOREIGN KEY (`regionID`) REFERENCES `Region`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Site` ADD CONSTRAINT `Site_companyID_fkey` FOREIGN KEY (`companyID`) REFERENCES `Societe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sinistre` ADD CONSTRAINT `Sinistre_chauffeurEmail_fkey` FOREIGN KEY (`chauffeurEmail`) REFERENCES `Chauffeur`(`email`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeclarationSinistre` ADD CONSTRAINT `DeclarationSinistre_Dossier_fkey` FOREIGN KEY (`Dossier`) REFERENCES `Sinistre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntretienPostAccident` ADD CONSTRAINT `EntretienPostAccident_chauffeurID_fkey` FOREIGN KEY (`chauffeurID`) REFERENCES `Chauffeur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntretienVehicule` ADD CONSTRAINT `EntretienVehicule_chauffeurID_fkey` FOREIGN KEY (`chauffeurID`) REFERENCES `Chauffeur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ManagerToSociete` ADD CONSTRAINT `_ManagerToSociete_A_fkey` FOREIGN KEY (`A`) REFERENCES `Manager`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ManagerToSociete` ADD CONSTRAINT `_ManagerToSociete_B_fkey` FOREIGN KEY (`B`) REFERENCES `Societe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
