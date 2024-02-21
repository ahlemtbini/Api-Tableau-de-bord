-- AlterTable
ALTER TABLE `entretienpostaccident` MODIFY `Heure_accident` ENUM('Entre_3h_6h', 'Entre_6h_9h', 'Entre_9h_11h', 'Entre_11h_13h', 'Entre_13h_15h', 'Entre_15h_17h', 'Entre_17h_19h', 'Entre_19h_22h', 'Entre_22h_3h') NOT NULL,
    MODIFY `Heure_prise_service` ENUM('Entre_3h_6h', 'Entre_6h_9h', 'Entre_9h_11h', 'Entre_11h_13h', 'Entre_13h_15h', 'Entre_15h_17h', 'Entre_17h_19h', 'Entre_19h_22h', 'Entre_22h_3h') NOT NULL;
