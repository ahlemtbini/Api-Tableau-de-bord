-- DropForeignKey
ALTER TABLE `adminclient` DROP FOREIGN KEY `AdminClient_clientID_fkey`;

-- AlterTable
ALTER TABLE `adminclient` MODIFY `clientID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `AdminClient` ADD CONSTRAINT `AdminClient_clientID_fkey` FOREIGN KEY (`clientID`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
