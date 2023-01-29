const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.getAdmins = async (req, res, next) => {
    try {
        const admins = await prisma.adminClient.findMany({
          include: {
            client:true
          },
          include: {
            user:true,
          }
        })
        const arr= []
        admins.map(admin=>{
          arr.push({...admin.user,userId:admin.userId, clientID:admin.clientID,id:admin.id})
        })
        res.status(200).json(arr)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}
exports.getAdminClients = async (req, res, next) => {
    try {
      const { id } = req.params
      console.dir(id)
        const admin = await prisma.adminClient.findUnique({
          where:{
            userId: parseInt(id)
          },include: {
            user:true
          }, include:{
            client:true
          }
        })
        res.status(200).json(admin)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}
exports.getAdminSinistres = async (req, res, next) => {
    try {
      const { id } = req.params
      console.dir(id)
        const sinis = await prisma.sinistre.findMany({
          where:{
            creatorId : id
          },
          select : {
            declarationSinistre: true
          }
        })
        res.status(200).json(sinis)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}
exports.getSaClients = async (req, res, next) => {
    try {
      const { id } = req.params
        const admin = await prisma.superAdmin.findUnique({
          where:{
            id: parseInt(id)
          },select: {
            clients:true
          }
        })
        res.status(200).json(admin)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
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
      .catch(error=>res.status(404).json({error}))
      // .catch((error)=>res.status(404).json({error}))
    } catch (error) {
      res.status(404).json({error})
    }
  }

  exports.editAdmin = async (req, res, next) => {
    // console.dir(req.body)
    try {
        const { id } = req.params
        const admin = await prisma.adminClient.update({
            where: { id: Number(id) },
            data: {
              clientID: Number(req.body.clientID),
            }
        })
        delete req.body.clientID
        try {
        const user = await prisma.user.update({
          where: { id: admin.userId},
          data: req.body
        })
        } catch (error) {
          // res.status(404).json({ error: "email exise déja" })
          next(error)
        }
        res.status(200).json("client a été modifié avec succès")
    } catch (error) {
        // res.status(404).json({ error: "email exise déja" })
        next(error)
    }
}
  
exports.addClient = async (req, res, next) => {
    try {
        const adminClient = await prisma.adminClient.update({
            where: { userId: req.body.id },
            data: {
                clientID: req.body.clientID
            }
        })
        res.status(200).json(adminClient)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}
