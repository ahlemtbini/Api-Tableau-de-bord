const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
const { findSync } = require("@prisma/client/runtime");

const multer = require("multer")
const upload = require("../middlewares/multer-config")


const userCtrl = require("../controllers/user");
const clientsCtrl = require("../controllers/clients");
const sinistresCtrl = require("../controllers/sinistres");
const adminsCtrl = require("../controllers/admins");
const societesCtrl = require("../controllers/societes");
const sitesCtrl = require("../controllers/sites");
const managersCtrl = require("../controllers/managers");

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

// societes
router.get('/societes', societesCtrl.getSocietes)
router.get('/societes/:id', societesCtrl.getSociete)
router.get('/countries/:id', societesCtrl.getCountry)
router.post('/societes/add', societesCtrl.addSociete)
router.put('/societes/:id', societesCtrl.editSociete);
router.delete('/societes/:id', societesCtrl.deleteSociete);
// router.post('/societes/contrats', societesCtrl.addContrat)
// router.delete('/societes/contrats/:id', societesCtrl.deleteContrat)
// router.get('/societes/contrats/:id', societesCtrl.getContrats)
router.get('/countries', societesCtrl.getCountries)
router.get('/regions', societesCtrl.getRegions)

// managers
router.get('/managers', managersCtrl.getManagers)
router.get('/managers/userManagers/:id', managersCtrl.getUserManagers)
router.post('/managers/add', managersCtrl.createManager)
router.post('/managers/connetSocietes', managersCtrl.connectSocietes)
router.put('/managers/edit/:id', managersCtrl.editManager);
router.delete('/managers/:id', managersCtrl.deleteManager);

// sites
router.get('/sites', sitesCtrl.getSites)
router.get('/sites/:id', sitesCtrl.getSite)
router.get('/sites/user/:id', sitesCtrl.getUserSites)
router.post('/sites/add', sitesCtrl.createSite)
router.post('/sites/coonetSocietes', sitesCtrl.connectSites)
router.put('/sites/edit/:id', sitesCtrl.editSite);
router.delete('/sites/:id', sitesCtrl.deleteSite);
//regions

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
// router.get('/profile', async (req, res, next) => {
//   try {
//     const { id } = req.params
//       const admin = await prisma.superAdmin.findUnique({
//         where:{
//           id: parseInt(id)
//         },select: {
//           clients:true
//         }
//       })
//       res.status(200).json(admin)
//   } catch (error) {
//       // res.status(404).json({ error: error })
//       next(error)
//   }
// });
module.exports = router;
