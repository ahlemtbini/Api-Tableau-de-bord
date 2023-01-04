/*
  Warnings:

  - The primary key for the `profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `profile` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `picture`,
    ADD COLUMN `photo` VARCHAR(191) NULL,
    MODIFY `date_de_naissance` DATE NULL;
