const express = require("express");
//const router = require('express').Router();
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
const userCtrl = require("../controllers/user");
const clientsCtrl = require("../controllers/clients");
const multer = require("multer")
const upload = require("../middlewares/multer-config")


// user controller
router.get('/profile', userCtrl.getProfile);
router.get('/users', userCtrl.getUsers);
router.get('/users/:id', userCtrl.getUser);
router.post('/users/add', userCtrl.createUser);
router.put('/users/:id', userCtrl.editUser);
router.delete('/users/:id', userCtrl.deleteUser);
router.delete('/profile/:id', userCtrl.deleteProfile);

// clients controller
router.get('/clients', clientsCtrl.getClients)
router.get('/clients/:id', clientsCtrl.getClient)
router.post('/clients/add', clientsCtrl.addClient)
router.put('/clients/:id', clientsCtrl.editClient);
router.delete('/clients/:id', clientsCtrl.deleteClient);
router.post('/clients/addLogo/:id', upload, clientsCtrl.addLogo);
router.post('/clients/importAll', clientsCtrl.importAllClients)




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
