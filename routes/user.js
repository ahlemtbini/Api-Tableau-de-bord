const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
const { findSync } = require("@prisma/client/runtime");

const multer = require("multer")
const fleetriskAuth = require("../middlewares/fleetrisk");
const upload = require("../middlewares/multer-config")

const userCtrl = require("../controllers/user");
const clientsCtrl = require("../controllers/clients");
const sinistresCtrl = require("../controllers/sinistres");
const adminsCtrl = require("../controllers/admins");
const chauffeurCtrl = require("../controllers/chauffeurs");
const societesCtrl = require("../controllers/societes");
const sitesCtrl = require("../controllers/sites");
const managersCtrl = require("../controllers/managers");
const migrateCtrl = require("../controllers/migrateDB");
const objectiveCtrl = require("../controllers/objectives");
const postSinistreCtrl = require("../controllers/postSinistre");
const fleetriskCtrl = require("../controllers/fleetriskApi");

//Dashbord
router.get(`/dashbord/userPrefrnces/:id`, userCtrl.getDashbordPrefrences)
router.post('/dashbord/addUserPrefrnces', userCtrl.saveDashbordPrefrences)
router.put('/dashbord/upUserPrefrnces', userCtrl.upDashbordPrefrences)

//documents
router.post('/documents/save', upload, sinistresCtrl.saveDocs)
router.put('/documents/update', upload, sinistresCtrl.upDocs)

// user controller
router.get('/profile', userCtrl.getProfile);
router.get('/users', userCtrl.getUsers);
router.get('/users/:id', userCtrl.getUser);
router.post('/users/add', userCtrl.createUser);
router.put('/users/:id', userCtrl.editUser);
// router.delete('/users/deleteAll', userCtrl.deleteAll);
router.delete('/users/:id', userCtrl.deleteUser);
router.delete('/profile/:id', userCtrl.deleteProfile);

router.post('/users/login', userCtrl.login)
router.post('/users/refreshUser', userCtrl.refreshUser)
router.post('/users/forgotPass', userCtrl.forgotPassword)
router.post('/users/resetPass', userCtrl.resetPassword)
router.post('/users/addPhoto/:id', upload, userCtrl.addPhoto);
router.post('/clients/addPhoto/:id', upload, userCtrl.addPhoto);
router.post('/users/confirmationMail', userCtrl.confirmationMail)


// clients controller
router.get('/clients', clientsCtrl.getClients)
router.get('/clients/:id', clientsCtrl.getClient)
router.get('/admin/clients/:id', clientsCtrl.getAdminClient)
router.get('/clients/user_client/:id', clientsCtrl.getUserClient)
router.post('/clients/add', clientsCtrl.addClient)
router.put('/clients/:id', clientsCtrl.editClient);
router.delete('/clients/:id', clientsCtrl.deleteClient);
router.post('/clients/addLogo/:id', upload, clientsCtrl.addLogo);
router.post('/clients/importAll', clientsCtrl.importAllClients)

router.post('/clients/contrats', clientsCtrl.addContrat)
router.put('/clients/contrats/:id', clientsCtrl.editContrat)
router.delete('/clients/contrats/:id', clientsCtrl.deleteContrat)
router.get('/clients/contrats/:id', clientsCtrl.getContrats)
router.post('/clients/country', clientsCtrl.addCountry)
router.delete('/clients/countries/:id', clientsCtrl.deleteCountry)
router.get('/clients/countries/:id', clientsCtrl.getCountries)
router.post('/clients/region', clientsCtrl.addRegion)
router.delete('/clients/regions/:id', clientsCtrl.deleteRegion)
router.get('/initRegions/:id', clientsCtrl.initRegions)
router.get('/getClientByName/:name', clientsCtrl.getClientByName)

// sinistres
router.get('/sinistresAdminManager', sinistresCtrl.getSinisAdminManger)
router.get('/sinistres', sinistresCtrl.getSinistres)
router.get('/sinis/:id', sinistresCtrl.getSinis)
router.get('/sinistres/:id', sinistresCtrl.getSinistre)
router.post('/sinistres/add', sinistresCtrl.addSinistre)
router.delete('/sinistres/:id', sinistresCtrl.deleteSinistre)
router.delete('/sinistres/', sinistresCtrl.deleteAll)
router.put('/sinistres/:id', sinistresCtrl.editSinistre);
router.get('/decSinistres', sinistresCtrl.getDecSinistres)
router.delete('/decSinistres/:id', sinistresCtrl.deleteDecSinistre)
router.post('/sinistres/import', upload, sinistresCtrl.importExcel)
router.post('/sinistres/filtre', sinistresCtrl.getFiltredData)
router.get('/reparer', sinistresCtrl.reparerDateFormat)
router.post('/sinistres/etape3/:id', sinistresCtrl.saveDocuments)
// router.put('/sinistres/documents/:id', sinistresCtrl.editDocuments);

// admins
router.get('/admins', adminsCtrl.getAdmins)
router.get('/admins/sinistres/:id', adminsCtrl.getAdminSinistres)
router.get('/admins/clients/:id', adminsCtrl.getAdminClients)
router.get('/admins/saClients/:id', adminsCtrl.getSaClients)
router.post('/admins/add', adminsCtrl.createAdmin)
router.put('/admins/:id', adminsCtrl.editAdmin);
router.post('/admins/addClient', adminsCtrl.addClient)
// admins
router.get('/chauffeurs', chauffeurCtrl.getChauffeurs)
router.get('/chauffeurs/user/:id', chauffeurCtrl.getUserChauffeurs)
router.get('/chauffeurs/export/:id', chauffeurCtrl.getToExport)
router.get('/chauffeurs/:id', chauffeurCtrl.getChauffeur)
router.post('/chauffeurs/add', chauffeurCtrl.addChauffeur)
router.put('/chauffeurs/:id', chauffeurCtrl.editChauffeur)
router.delete('/chauffeurs/:id', chauffeurCtrl.deleteChauffeur)
router.post('/chauffeurs/import', upload, chauffeurCtrl.importChauffeurs)
// societes
router.get('/societes', societesCtrl.getSocietes)
router.post('/UserSocietesByRegion', societesCtrl.getSocietesByUserId)
router.get('/countries/:id', societesCtrl.getCountry)
router.post('/societes/add', societesCtrl.addSociete)
router.put('/societes/:id', societesCtrl.editSociete);
router.delete('/societes/:id', societesCtrl.deleteSociete);
// router.post('/societes/contrats', societesCtrl.addContrat)
// router.delete('/societes/contrats/:id', societesCtrl.deleteContrat)
// router.get('/societes/contrats/:id', societesCtrl.getContrats)
router.get('/countries', societesCtrl.getCountries)
router.get('/regions', societesCtrl.getRegions)
router.post('/societes/filtre', societesCtrl.getFiltredData)

// managers
router.get('/manager/sinistres/:id', managersCtrl.getManagerSinistres)
router.get('/managers', managersCtrl.getManagers)
router.get('/managers/:id', managersCtrl.getManager)
router.get('/managers/userManagers/:id', managersCtrl.getUserManagers)
router.post('/managers/add', managersCtrl.createManager)
router.post('/managers/connetSocietes', managersCtrl.connectSocietes)
router.put('/managers/edit/:id', managersCtrl.editManager);
router.delete('/managers/:id', managersCtrl.deleteManager);

// sites
router.get('/sites', sitesCtrl.getSites)
router.get('/sites/bySoiciete/:id', sitesCtrl.getSitesBySocieteId)
router.get('/sites/byRegion/:id', sitesCtrl.getSitesByRegionID)
router.get('/sites/byName/:name', sitesCtrl.getSiteByName)
router.get('/sites/:id', sitesCtrl.getSite)
router.get('/sites/user/:id', sitesCtrl.getUserSites)
router.post('/sites/add', sitesCtrl.createSite)
router.post('/sites/coonetSocietes', sitesCtrl.connectSites)
router.put('/sites/edit/:id', sitesCtrl.editSite);
router.delete('/sites/:id', sitesCtrl.deleteSite);
//regions

// Objectives
router.post('/objectifs/manager/:id', objectiveCtrl.getManagerAll)
router.post('/objectifs/getAll', objectiveCtrl.getAll)
router.post('/objectifs/getByName', objectiveCtrl.getByName)
router.post('/objectifs/add', objectiveCtrl.addObjective)
router.delete('/objectifs/:id', objectiveCtrl.deleteObjective)
router.post('/objectifs/filter', objectiveCtrl.getFiltred)
// router.put('/objectives/up', objectiveCtrl.upObjective);
// router.delete('/objectives/:id', sitesCtrl.deleteSite);

// migrate
router.get('/sinis', migrateCtrl.getSinistres)
router.get('/migrateSinis', migrateCtrl.addSinistres)
router.get('/migrateUsers', migrateCtrl.createUsers)
router.get('/admins', migrateCtrl.getAdmins)
router.get('/migrateAdmins', migrateCtrl.createAdmins)
router.get('/manags', migrateCtrl.getManagers)
// post-sinistres
router.get('/postSinistres', postSinistreCtrl.getEPS)
router.post('/getUserEpsList', postSinistreCtrl.getUserEpsList)
router.post('/postSinistres/add', postSinistreCtrl.addEPS)
router.put('/postSinistres/:id', postSinistreCtrl.upEPS)
router.delete('/postSinistres/:id', postSinistreCtrl.deleteEPS)


/**
 * @swagger
 * tags:
 *   name: FleetRisk
 *   description: tableau de bord
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Ajouter ici votre token pour acceder au API
 */

/**
 * @swagger
 * /fleetrisk/dashboard:
 *   post:
 *     summary: Obtenez les graphiques du tableau de bord FleetRisk
 *     description: Récupère les données graphiques pour le tableau de bord FleetRisk.
 *     tags: [FleetRisk]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               annee:
 *                 type: string
 *                 description: Année  (facultatif)
 *               region:
 *                 type: string
 *                 description: Nom de la région (facultatif,non sensible à la casse) 
 *                 exemple : SIEGE,siege,ILE_DE_FRANCE,NORD,ROUSSILLON,PROVENCE,SUD_OUEST,RHONE_ALPES,ATLANTIQUE
 *               societe:
 *                 type: string
 *                 description: Nom de la société (facultatif,non sensible à la casse)
 *                 exemple: PRIMEVER SERVICES,primever services,INSECO,IMAGE
 *               site:
 *                 type: string
 *                 description: Nom du site (facultatif,non sensible à la casse)
 *                 exemple: PTSO (MERLE)	,ptso (merle),SATAR MOISSAC,PRIMEVER LIMOUSIN OBJAT
 *             example:
 *               annee: 2023
 *               region: null
 *               societe: null
 *               site: null
 *     responses:
 *       200:
 *         description: Succès. Renvoie les données du tableau de bord FleetRisk
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 "Nombre de sinistres":
 *                   type: object
 *                   properties:
 *                     tous:
 *                       type: integer
 *                       description: Nombre total d'accidents.
 *                     sansDoublons:
 *                       type: integer
 *                       description: Nombre d'accidents sans doublons.
 *                 "Nbr sinistres par jour":
 *                   type: object
 *                   properties:
 *                     res:
 *                       type: number
 *                       description: Nbr sinistres par jour.
 *                     nbre de sinistres:
 *                       type: integer
 *                       description: Nombre d'accidents.
 *                     nbre de jours depuis debut d'année:
 *                       type: integer
 *                       description: Nombre de jours depuis le début de l'année.
 *                 "Objectifs charge sinistres": 
 *                   type: string
 *                   example: "50 000 €"
 *                   description: Inscrire un objectif  (choisi par le client) une fois par an. Doit s'adapter à la date  de démarrage et de fin du contrat. Doit pouvoir se comparer d'une année sur l'autre
 *                 "Charge estimée":
 *                   type: integer
 *                   example: 622000
 *                   description: Somme  colonne charge réelle selon sélection année/trimestre/mois
 *                 "Coût Sinistre Moyen": 
 *                   type: string
 *                   example: "4 231 €"
 *                   description : Charge réelle/nombre de sinistre
 *                 "Répartition des sinistres par":
 *                   type: object
 *                   description: Charge Réelle en % de l'objectif/ Client/Region/Société
 *                   properties:
 *                     ILE_DE_FRANCE:
 *                       type: integer
 *                       description: Nombre d'accidents en Île de France.
 *                     SIEGE:
 *                       type: integer
 *                       description: Nombre d'accidents au siège.
 *                     NORD:
 *                       type: integer
 *                       description: Nombre d'accidents dans la région Nord.
 *                     ROUSSILLON:
 *                       type: integer
 *                       description: Nombre d'accidents à Roussillon.
 *                     PROVENCE:
 *                       type: integer
 *                       description: Nombre d'accidents en Provence.
 *                     SUD_OUEST:
 *                       type: integer
 *                       description: Nombre d'accidents dans la région Sud-Ouest.
 *                     RHONE_ALPES:
 *                       type: integer
 *                       description: Nombre d'accidents en Rhône-Alpes.
 *                     ATLANTIQUE:
 *                       type: integer
 *                       description: Nombre d'accidents dans la région Atlantique.
 *                     Indeterminé:
 *                       type: integer
 *                       description: Nombre d'accidents avec une région indéterminée.
 *                 "Répartition des sinistres par cas":
 *                   type: object
 *                   description: nombre de sinistres par Colonne CAS (Manœuvre, Arrêt, Circulation) + %
 *                   properties:
 *                     nbe:
 *                       description: Tableau des comptes d'accidents.
 *                     %:
 *                       description: Tableau des pourcentages d'accidents.
 *                 "Taux de respect de l'objectif": 
 *                   type: integer
 *                   example: 1244
 *                   description: Taux de respect de l'objectif suivant l'avancée de l'année (12 mois) Doit s'adapter à la date  de démarrage et de fin du contrat.
 *                 "Top 5 sinistres":
 *                   description: Les 5 plus gros sinistres (charge réelle)/Conducteur/Région/Société/Date de survenance Mettre Somme Charge en % de l'objetif total (Client)
 *                 "Saisonnalité de la fréquence sinistre":
 *                   type: object
 *                   description: Nombre de sinistre par mois + Nombre de sinistre représenté par jour de semaine
 *                   properties:
 *                     months:
 *                       type: object
 *                       description: Objet représentant le nombre d'accidents par mois.
 *                     days:
 *                       type: object
 *                       description: Objet représentant le nombre d'accidents par jour de la semaine.
 *                 "Liste Chauffeur Récidiviste":
 *                   description: Afficher Chauffeurs ayant au moins 2 sinistres avec Charge cumulée et nombre de sinistes sur 2 ans
 *                   items:
 *                     type: object
 *                     properties:
 *                       Nom du chauffeur:
 *                         type: string
 *                         description: Nom du chauffeur.
 *                       Région:
 *                         type: string
 *                         description: Région du chauffeur.
 *                       Société:
 *                         type: string
 *                         description: Entreprise du chauffeur.
 *                       Montant:
 *                         type: string
 *                         description: Montant lié au chauffeur.
 *                       Nbre. sinistres:
 *                         type: integer
 *                         description: Nombre d'accidents liés au chauffeur.
 *                 "Responsabilité":
 *                   type: object
 *                   properties:
 *                     charge:
 *                       description: Nombre sinistre Responsable/Non responsable/Responsabilité Partagée et charges réelles correspondante  en €
 *                     %:
 *                       description: Nombre sinistre Responsable/Non responsable/Responsabilité Partagée en %.
 *                 "Jour de la semaine vs Responsabilité":
 *                   description: Mix responsabilité par jour de survenance sur une année (le jeudi 80% des sinistres responsable et 20% non responsable)
 *                   type: object
 *                   properties:
 *                     lundi:
 *                       type: object
 *                       description: Statistiques pour le lundi.
 *                     mardi:
 *                       type: object
 *                       description: Statistiques pour le mardi.
 *                     mercredi:
 *                       type: object
 *                       description: Statistiques pour le mercredi.
 *                     jeudi:
 *                       type: object
 *                       description: Statistiques pour le jeudi.
 *                     vendredi:
 *                       type: object
 *                       description: Statistiques pour le vendredi.
 *                     samedi:
 *                       type: object
 *                       description: Statistiques pour le samedi.
 *                     dimanche:
 *                       type: object
 *                       description: Statistiques pour le dimanche.
 *                 "Année de véhicule":
 *                   type: array
 *                   description: Nombre de sinistre selon Année du véhicule (1première MEC) ou répartir en 3 caatégorie  0-3 ans/3-6ans/ + de 6 ans
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: integer
 *                         description: Année du véhicule.
 *                       value:
 *                         type: integer
 *                         description: Nombre d'accidents associés à cette année.
 *                       percentage:
 *                         type: integer
 *                         description: Pourcentage d'accidents associés à cette année.
 *                 "Sinistres par plages horaires":
 *                   type: object
 *                   description: Nombre de sinistre par plages horaires
 *                   properties:
 *                     nbr:
 *                       description: Tableau représentant le nombre d'accidents par plage horaire.
 *                     %:
 *                       description: Tableau représentant le pourcentage d'accidents par plage horaire.
 *             example: 
 *               {
 *                 "Nombre de sinistres": {
 *                   "tous": 147,
 *                   "sansDoublons": 133
 *                 },
 *                 "Nbr. sinistres par jour": {
 *                   "res": 0.4,
 *                   "nbre de sinistres": 147,
 *                   "nbre de jours depuis debut d'année": 364
 *                 },
 *                 "Objectifs charge sinistres": "50 000 €",
 *                 "Charge estimée": 622000,
 *                 "Coût Sinistre Moyen": "4 231 €",
 *                 "Répartition des sinistres par": {
 *                   "ILE_DE_FRANCE": 22708,
 *                   "SIEGE": 4132,
 *                   "NORD": 183667,
 *                   "ROUSSILLON": 58086,
 *                   "PROVENCE": 41983,
 *                   "SUD_OUEST": 192762,
 *                   "RHONE_ALPES": 72541,
 *                   "ATLANTIQUE": 46001,
 *                   "Indeterminé": 0
 *                 },
 *                 "Répartition des sinistres par cas": {
 *                   "nbe": [46, 22, 74, 5],
 *                   "%": [{"Arret": 31.292517006802722}, {"Manoeuvre": 14.965986394557824}, {"En_Circulation": 50.34013605442177}, {"Indéterminé": 3.401360544217687}]
 *                 },
 *                 "Taux de respect de l'objectif": 1244,
 *                 "Top 5 sinistres": [
 *                   {"charge réelle": [47500, "SAIDI OUSSAMA", "SUD_OUEST", "STSO", "20-04-2023"]},
 *                   {"Conducteur": [55000, "HALOUAHID BANYAMMOU", "RHONE_ALPES", "PRIMEVER TRANSPORT RHONE_ALPES", "17-01-2023"]},
 *                   {"Région": [60000, "SAIDI OUSSAMA", "SUD_OUEST", "STSO", "20-04-2023"]},
 *                   {"Société": [60451, "MOREIRA ANTHONY", "SUD_OUEST", "PRIMEVER LIMOUSIN", "26-01-2023"]},
 *                   {"Date de survenance": [80000, "MOLISAK JEREMIE", "NORD", "GUIDEZ", "13-03-2023"]}
 *                 ],
 *                 "Saisonnalité de la fréquence sinistre": {
 *                   "months": {"Janvier": 30, "février": 17, "mars": 24, "avril": 22, "mai": 22, "juin": 13, "juillet": 4, "août": 12, "septembre": 3, "octobre": 0, "novembre": 0, "décembre": 0},
 *                   "days": {"lundi": 17, "mardi": 35, "mercredi": 22, "jeudi": 33, "vendredi": 20, "samedi": 16, "dimanche": 4}
 *                 },
 *                 "Liste Chauffeur Récidiviste": [
 *                   {"Nom du chauffeur": "X X", "Région": "NORD", "Société": "GUIDEZ", "Montant": null, "Nbre. sinistres": 16},
 *                   {"Nom du chauffeur": "DURIMEL MICHAEL", "Région": "SUD_OUEST", "Société": "SBG", "Montant": 2736, "Nbre. sinistres": 2},
 *                   {"Nom du chauffeur": "EL MOUBARIKI", "Région": "PROVENCE", "Société": "PRIMEVER PROVENCE", "Montant": 3552, "Nbre. sinistres": 2},
 *                   {"Nom du chauffeur": "MOLISAK JEREMIE", "Région": "NORD", "Société": "GUIDEZ", "Montant": 113500, "Nbre. sinistres": 2},
 *                   {"Nom du chauffeur": "HALOUAHID BANYAMMOU", "Région": "RHONE_ALPES", "Société": "PRIMEVER TRANSPORT RHONE_ALPES", "Montant": 64465.74, "Nbre. sinistres": 2},
 *                   {"Nom du chauffeur": "SAIDI OUSSAMA", "Région": "SUD_OUEST", "Société": "STSO", "Montant": 107500, "Nbre. sinistres": 2},
 *                   {"Nom du chauffeur": "MARTIN LUDOVIC", "Région": "SUD_OUEST", "Société": "STSO", "Montant": 3552, "Nbre. sinistres": 2},
 *                   {"Nom du chauffeur": "TURGIS CEDRIC", "Région": "ATLANTIQUE", "Société": "PRIMEVER NORMANDIE", "Montant": 400, "Nbre. sinistres": 2},
 *                   {"Nom du chauffeur": "PIET PATRICE", "Région": "SUD_OUEST", "Société": "PRIMEVER LIMOUSIN", "Montant": -8176, "Nbre. sinistres": 9},
 *                   {"Nom du chauffeur": "BELATTAR SAMIR", "Région": "PROVENCE", "Société": "PRIMEVER TRANSPORT CHATEAURENARD", "Montant": 1776, "Nbre. sinistres": 2},
 *                   {"Nom du chauffeur": "BORRAS JIMMY", "Région": "ROUSSILLON", "Société": "PRIMEVER ROUSSILLON", "Montant": 200, "Nbre. sinistres": 2},
 *                   {"Nom du chauffeur": "COLLIGNON KEVIN", "Région": "ILE_DE_FRANCE", "Société": "PRIMEVER TROYES", "Montant": 4000, "Nbre. sinistres": 2},
 *                   {"Nom du chauffeur": "LABRECHE CHAOUKIE", "Région": "ILE_DE_FRANCE", "Société": "PRIMEVER TROYES", "Montant": null, "Nbre. sinistres": 2}
 *                 ],
 *                 "Responsabilité": {
 *                   "charge": [
 *                     {"title": "Responsable", "value": "526 925", "percentage": 87},
 *                     {"title": "Non responsable", "value": "74 010", "percentage": 12},
 *                     {"title": "Partagée", "value": "1 778", "percentage": 0},
 *                     {"title": "Indéterminé", "percentage": 0}
 *                   ],
 *                   "%": [
 *                     {"title": "Responsable", "value": 64, "percentage": 44},
 *                     {"title": "Non responsable", "value": 76, "percentage": 52},
 *                     {"title": "Partagée", "value": 2, "percentage": 1},
 *                     {"title": "Indéterminé", "value": 5, "percentage": 3}
 *                   ]
 *                 },
 *                 "Jour de la semaine vs Responsabilité": {
 *                   "lundi": {"responsable": 35, "nonResponsable": 65, "responsabilitePartagee": 0, "Indétérminé": 0},
 *                   "mardi": {"responsable": 43, "nonResponsable": 51, "responsabilitePartagee": 3, "Indétérminé": 3},
 *                   "mercredi": {"responsable": 36, "nonResponsable": 59, "responsabilitePartagee": 0, "Indétérminé": 5},
 *                   "jeudi": {"responsable": 45, "nonResponsable": 52, "responsabilitePartagee": 0, "Indétérminé": 3},
 *                   "vendredi": {"responsable": 55, "nonResponsable": 40, "responsabilitePartagee": 0, "Indétérminé": 5},
 *                   "samedi": {"responsable": 44, "nonResponsable": 50, "responsabilitePartagee": 6, "Indétérminé": 0},
 *                   "dimanche": {"responsable": 50, "nonResponsable": 25, "responsabilitePartagee": 0, "Indétérminé": 25}
 *                 },
 *                 "Année de véhicule": [
 *                   {"title": 2020, "value": 72, "percentage": 62},
 *                   {"title": 2021, "value": 23, "percentage": 20},
 *                   {"title": 2022, "value": 18, "percentage": 15},
 *                   {"title": 2023, "value": 4, "percentage": 3}
 *                 ],
 *                 "Sinistres par plages horaires": {
 *                   "nbr": [
 *                     {"Entre_3h_6h": 12},
 *                     {"Entre_6h_9h": 19},
 *                     {"Entre_9h_11h": 23},
 *                     {"Entre_11h_13h": 21},
 *                     {"Entre_13h_15h": 20},
 *                     {"Entre_15h_17h": 8},
 *                     {"Entre_17h_19h": 10},
 *                     {"Entre_19h_22h": 8},
 *                     {"Entre_22h_3h": 7},
 *                     {"Aucun": 7}
 *                   ],
 *                   "%": [
 *                     {"Entre_3h_6h": 8.16326530612245},
 *                     {"Entre_6h_9h": 12.92517006802721},
 *                     {"Entre_9h_11h": 15.646258503401361},
 *                     {"Entre_11h_13h": 14.285714285714286},
 *                     {"Entre_13h_15h": 13.605442176870747},
 *                     {"Entre_15h_17h": 5.442176870748299},
 *                     {"Entre_17h_19h": 6.802721088435374},
 *                     {"Entre_19h_22h": 5.442176870748299},
 *                     {"Entre_22h_3h": 4.761904761904762},
 *                     {"Aucun": 4.761904761904762}
 *                   ]
 *                 }
 *             }
 *       401:
 *         description: Non autorisé. L'utilisateur doit être authentifié avec un jeton JWT.
 *       404:
 *         description: Ressource non trouvée. Les données du tableau de bord n'ont pas pu être récupérées.
 *       500:
 *         description: Erreur interne du serveur. Veuillez réessayer ultérieurement.
 */
// fleetrisk api
router.post('/fleetrisk/dashbord',fleetriskAuth, fleetriskCtrl.getGraphs)
router.get('/fleetrisk/admins', fleetriskCtrl.getAdmins)
router.delete('/fleetrisk/delete-admins', fleetriskCtrl.deleteAdmins)
router.post('/fleetrisk/signup', fleetriskCtrl.register)
router.post('/fleetrisk/login', fleetriskCtrl.login)

/*
async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
*/

module.exports = router;
