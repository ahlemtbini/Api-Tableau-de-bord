const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.getAdmins = async (req, res, next) => {
    try {
        const admins = await prisma.adminClient.findMany()
        res.status(200).json(admins)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}
exports.createAdmin = (req, res, next) => {
    try {
      const unhasheMdp = req.body.user.mdp ? req.body.user.mdp :"default"
      bcrypt.hash(unhasheMdp, 10)
      .then(async(hash)=>{
        const user = await prisma.user.create({
            data: {
              ...req.body.user,
              mdp: hash
            }
        })
        const admin =await prisma.adminClient.create({
          data: {
            userId: user.id,
          }
        })
        return res.status(200).json(admin)
      })
      .catch(error=>next(error))
      // .catch((error)=>res.status(404).json({error}))
    } catch (error) {
      next(error)
    }
  }
  
exports.addClient = async (req, res, next) => {
    try {
        const adminClient = await prisma.adminClient.update({
            where: { id: req.body.id },
            data: {
                clientID: req.body.clientID
            }
        })
        res.status(200).json(adminClient)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}
