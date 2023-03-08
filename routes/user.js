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

// user controller
router.get('/profile', userCtrl.getProfile);
router.get('/users', userCtrl.getUsers);
router.get('/users/:id', userCtrl.getUser);
router.post('/users/add', userCtrl.createUser);
router.put('/users/:id', userCtrl.editUser);
router.delete('/users/deleteAll', userCtrl.deleteAll);
router.delete('/users/:id', userCtrl.deleteUser);
router.delete('/profile/:id', userCtrl.deleteProfile);

router.post('/users/login', userCtrl.login)
router.post('/users/refreshUser', userCtrl.refreshUser)
router.post('/users/forgotPass', userCtrl.forgotPassword)
router.post('/users/resetPass', userCtrl.resetPassword)
router.post('/users/addPhoto/:id', upload, userCtrl.addPhoto);
router.post('/clients/addPhoto/:id', upload, userCtrl.addPhoto);

// clients controller
router.get('/clients', clientsCtrl.getClients)
router.get('/clients/:id', clientsCtrl.getClient)
router.get('/admin/clients/:id', clientsCtrl.getAdminClient)
router.post('/clients/add', clientsCtrl.addClient)
router.put('/clients/:id', clientsCtrl.editClient);
router.delete('/clients/:id', clientsCtrl.deleteClient);
router.post('/clients/addLogo/:id', upload, clientsCtrl.addLogo);
router.post('/clients/importAll', clientsCtrl.importAllClients)

router.post('/clients/contrats', clientsCtrl.addContrat)
router.delete('/clients/contrats/:id', clientsCtrl.deleteContrat)
router.get('/clients/contrats/:id', clientsCtrl.getContrats)
router.post('/clients/country', clientsCtrl.addCountry)
router.delete('/clients/countries/:id', clientsCtrl.deleteCountry)
router.get('/clients/countries/:id', clientsCtrl.getCountries)
router.post('/clients/region', clientsCtrl.addRegion)
router.delete('/clients/regions/:id', clientsCtrl.deleteRegion)

// sinistres
router.get('/sinistres', sinistresCtrl.getSinistres)
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
router.post('/societes/add', societesCtrl.addSociete)
router.put('/societes/:id', societesCtrl.editSociete);
router.delete('/societes/:id', societesCtrl.deleteSociete);
// router.post('/societes/addLogo/:id', upload, societesCtrl.addLogo);
// router.post('/societes/importAll', societesCtrl.importAllSocietes)
// router.post('/societes/contrats', societesCtrl.addContrat)
// router.delete('/societes/contrats/:id', societesCtrl.deleteContrat)
// router.get('/societes/contrats/:id', societesCtrl.getContrats)

// sites
router.get('/sites', sitesCtrl.getSites)

// managers
router.get('/managers', managersCtrl.getManagers)


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
