const express = require("express");
//const router = require('express').Router();
const router = express.Router();

const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()

  router.get('/posts', async (req, res, next) => {
    try {
      const posts = await prisma.post.findMany({})
      res.json(posts)
    } catch (error) {
      next(error)
    }
  });

  router.get('/profile', async (req, res, next) => {
    try {
      const profile = await prisma.profile.findMany({})
      res.json(profile)
    } catch (error) {
      next(error)
    }
  });


  router.get('/users', async (req, res, next) => {
    try {
      const users = await prisma.user.findMany({
        include: {
          posts: true,
          profile: true,
        },
      })
      res.json(users)
    } catch (error) {
      next(error)
    }
  });

  router.get('/users/:id', async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          posts: true,
          profile: true
        }
      })
      res.json(user)
    } catch (error) {
      next(error)
    }
  });

  router.post('/addUser', async (req, res, next) => {
    try {
      const user = await prisma.user.create({
        data: req.body
      })
      res.json(user)
    } catch (error) {
      next(error)
    }
  });

  router.put('/users/:id', async (req, res, next) => {
    try {
      const {id} = req.params
      const user= await prisma.user.update({
        where: { id: Number(id) },
        data: req.body,
      })
      res.json(user)
    } catch (error) {
      next(error)
    }
  });

  router.delete('/users/:id', async (req, res, next) => {
    try {
      const {id} = req.params
      const user= await prisma.user.delete({
        where: { id: Number(id) },
      })
      res.json(user)
    } catch (error) {
      next(error)
    }
  });

  router.delete('/profile/:id', async (req, res, next) => {
    try {
      const {id} = req.params
      const profile= await prisma.profile.delete({
        where: { id: Number(id) },
      })
      res.json(profile)
    } catch (error) {
      next(error)
    }
  });
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
