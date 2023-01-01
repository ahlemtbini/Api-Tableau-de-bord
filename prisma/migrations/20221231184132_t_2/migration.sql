/*
  Warnings:

  - You are about to drop the column `%RC` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `1ère MEC` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Année` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `CESSION/EPAVE` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Cas IDA` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Charge Provisionnelle Solaris` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Charge ajustée` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Charge réelle` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Cie adv.` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Constat original O/N` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Conv.` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Date EXPERTISE` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Date MISSIONNEMENT` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Date RAPPORT` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Date RAPPORT DEFINITIF` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Date Survenance.` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Date clot.` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Date de relance pièces M` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Date récep.` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Dossier Client` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Détail pièces manquantes` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Immatriculation` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `LIEU SINISTRE` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Lieu expertise` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Mt Dom.` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Mt rec.` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Numéro Client` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Numéro Contrat` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Perte Fi` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Pièces manquantes O/N` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `REPARATION O/N` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Ref Sinistre Assureur` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Ref expertise` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Région` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `Type Véhicule` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to drop the column `coût expert` on the `declarationsinistre` table. All the data in the column will be lost.
  - You are about to alter the column `ETAT` on the `declarationsinistre` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(22))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `declarationsinistre` DROP COLUMN `%RC`,
    DROP COLUMN `1ère MEC`,
    DROP COLUMN `Année`,
    DROP COLUMN `CESSION/EPAVE`,
    DROP COLUMN `Cas IDA`,
    DROP COLUMN `Charge Provisionnelle Solaris`,
    DROP COLUMN `Charge ajustée`,
    DROP COLUMN `Charge réelle`,
    DROP COLUMN `Cie adv.`,
    DROP COLUMN `Constat original O/N`,
    DROP COLUMN `Conv.`,
    DROP COLUMN `Date EXPERTISE`,
    DROP COLUMN `Date MISSIONNEMENT`,
    DROP COLUMN `Date RAPPORT`,
    DROP COLUMN `Date RAPPORT DEFINITIF`,
    DROP COLUMN `Date Survenance.`,
    DROP COLUMN `Date clot.`,
    DROP COLUMN `Date de relance pièces M`,
    DROP COLUMN `Date récep.`,
    DROP COLUMN `Dossier Client`,
    DROP COLUMN `Détail pièces manquantes`,
    DROP COLUMN `Immatriculation`,
    DROP COLUMN `LIEU SINISTRE`,
    DROP COLUMN `Lieu expertise`,
    DROP COLUMN `Mt Dom.`,
    DROP COLUMN `Mt rec.`,
    DROP COLUMN `Numéro Client`,
    DROP COLUMN `Numéro Contrat`,
    DROP COLUMN `Perte Fi`,
    DROP COLUMN `Pièces manquantes O/N`,
    DROP COLUMN `REPARATION O/N`,
    DROP COLUMN `Ref Sinistre Assureur`,
    DROP COLUMN `Ref expertise`,
    DROP COLUMN `Région`,
    DROP COLUMN `Type Véhicule`,
    DROP COLUMN `coût expert`,
    ADD COLUMN `ANNEE` VARCHAR(191) NULL,
    ADD COLUMN `ASSUREUR_ADV` VARCHAR(191) NULL,
    ADD COLUMN `CAS_IDA` VARCHAR(191) NULL,
    ADD COLUMN `CESSION_EPAVE` ENUM('oui', 'non') NULL,
    ADD COLUMN `CHARGE_AJUSTEE` VARCHAR(191) NULL,
    ADD COLUMN `CHARGE_PROVISIONNELLE_ASSUREUR` VARCHAR(191) NULL,
    ADD COLUMN `CHARGE_REELLE` VARCHAR(191) NULL,
    ADD COLUMN `CONSTAT_ORIGINAL` ENUM('oui', 'non') NULL,
    ADD COLUMN `CONVENTION` ENUM('oui', 'non') NULL,
    ADD COLUMN `COUT_EXPERT` VARCHAR(191) NULL,
    ADD COLUMN `DATE_CLOTURE` VARCHAR(191) NULL,
    ADD COLUMN `DATE_EXPERTISE` VARCHAR(191) NULL,
    ADD COLUMN `DATE_MISSIONNEMENT` VARCHAR(191) NULL,
    ADD COLUMN `DATE_PRE_RAPPORT` VARCHAR(191) NULL,
    ADD COLUMN `DATE_RAPPORT_DEFINITIF` VARCHAR(191) NULL,
    ADD COLUMN `DATE_RECEPTION` VARCHAR(191) NULL,
    ADD COLUMN `DATE_RELANCE_PIECES_MANQUANTES` VARCHAR(191) NULL,
    ADD COLUMN `DATE_SURVENANCE` VARCHAR(191) NULL,
    ADD COLUMN `DETAIL_PIECES_MANQUANTES` VARCHAR(191) NULL,
    ADD COLUMN `DOSSIER_CLIENT` VARCHAR(191) NULL,
    ADD COLUMN `IMMATRICULATION` VARCHAR(191) NULL,
    ADD COLUMN `LIEU_EXPERTISE` VARCHAR(191) NULL,
    ADD COLUMN `LIEU_SINISTRE` VARCHAR(191) NULL,
    ADD COLUMN `MONTANT_DOM` VARCHAR(191) NULL,
    ADD COLUMN `MONTANT_RECOURS` VARCHAR(191) NULL,
    ADD COLUMN `NUMERO_CLIENT` VARCHAR(191) NULL,
    ADD COLUMN `NUMERO_CONTRAT` VARCHAR(191) NULL,
    ADD COLUMN `PERTE_FI` ENUM('oui', 'non') NULL,
    ADD COLUMN `PIECES_MANQUANTES` ENUM('oui', 'non') NULL,
    ADD COLUMN `POURCENTAGE_RC` VARCHAR(191) NULL,
    ADD COLUMN `PREMIERE_MEC` VARCHAR(191) NULL,
    ADD COLUMN `REF_EXPERTISE` VARCHAR(191) NULL,
    ADD COLUMN `REF_SINISTRE_ASUREUR` VARCHAR(191) NULL,
    ADD COLUMN `REGION` VARCHAR(191) NULL,
    ADD COLUMN `REPARATION` ENUM('oui', 'non') NULL,
    ADD COLUMN `TYPE_VEHICULE` VARCHAR(191) NULL,
    MODIFY `ETAT` VARCHAR(191) NULL;
