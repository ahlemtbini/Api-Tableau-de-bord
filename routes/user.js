const express = require("express");
//const router = require('express').Router();
const router = express.Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const userCtrl = require("../controllers/user");
const clientsCtrl = require("../controllers/clients");

//   router.get('/clients',async (req, res, next) => {
//     try {
//       const profile = await prisma.user.findMany({})
//       res.json(profile)
//     } catch (error) {
//       next(error)
//     }
// })
  // user controller
  router.get('/profile', userCtrl.getProfile);
  router.get('/users', userCtrl.getUsers);
  router.get('/users/:id', userCtrl.getUser);
  router.post('/addUser', userCtrl.createUser );
  router.put('/users/:id', userCtrl.editUser);
  router.delete('/users/:id',userCtrl.deleteUser);
  router.delete('/profile/:id', userCtrl.deleteProfile);

  // clients controller

  router.get('/clients', clientsCtrl.getClients)
  router.post('/clients/add', clientsCtrl.getClients)


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
