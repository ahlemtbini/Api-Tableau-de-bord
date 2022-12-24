/*
  Warnings:

  - The values [Arrêt,En Circulation,Manœuvre] on the enum `DeclarationSinistre_CAS` will be removed. If these variants are still used in the database, this will fail.
  - The values [Non Auto] on the enum `DeclarationSinistre_Nature` will be removed. If these variants are still used in the database, this will fail.
  - The values [Déclaration Chauffeur] on the enum `DeclarationSinistre_Détail pièces manquantes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `declarationsinistre` MODIFY `CAS` ENUM('Arret', 'En_Circulation', 'Manoeuvre') NULL,
    MODIFY `Nature` ENUM('Etranger', 'Corpo', 'Non_Auto') NULL,
    MODIFY `Détail pièces manquantes` ENUM('Devis', 'CG', 'Permis', 'Facture', 'DC', 'PV', 'Constat') NULL;
