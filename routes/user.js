const express = require("express");
//const router = require('express').Router();
const router = express.Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const userCtrl = require("../controllers/user");

  router.get('/posts', async (req, res, next) => {
    try {
      const posts = await prisma.post.findMany({})
      res.json(posts)
    } catch (error) {
      next(error)
    }
  });

  // user controller
  router.get('/profile', userCtrl.getProfile);
  router.get('/users', userCtrl.getUsers);
  router.get('/users/:id', userCtrl.getUser);
  router.post('/addUser', userCtrl.createUser );
  router.put('/users/:id', userCtrl.editUser);
  router.delete('/users/:id',userCtrl.deleteUser);
  router.delete('/profile/:id', userCtrl.deleteProfile);

  // admin controller


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
