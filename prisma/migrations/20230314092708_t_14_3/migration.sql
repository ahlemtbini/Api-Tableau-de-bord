/*
  Warnings:

  - You are about to drop the column `name` on the `site` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tel` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `site` DROP COLUMN `name`,
    ADD COLUMN `clientId` INTEGER NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `nom` VARCHAR(191) NOT NULL,
    ADD COLUMN `numSiret` VARCHAR(191) NULL,
    ADD COLUMN `tel` VARCHAR(191) NOT NULL,
    MODIFY `isActive` BOOLEAN NOT NULL DEFAULT true;
