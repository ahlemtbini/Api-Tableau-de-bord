const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const send_mail = require("../utility/sendEmail");

exports.getChauffeurs = async (req, res, next) => {
    try {
        const chauffeurs = await prisma.chauffeur.findMany({
          include: {
            user: {
              include: {
                profile: true
              }
            }
          },
        })
        const arr= []
        res.status(200).json(chauffeurs)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}
exports.getChauffeur = async (req, res, next) => {
    try {
      const { id } = req.params
        const admin = await prisma.chauffeur.findUnique({
          where:{
            userId: parseInt(id)
          },
          include: {
            user:true,
          }
        })
        res.status(200).json(admin)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}
exports.addChauffeur = (req, res, next) => {
    try {
      const unhasheMdp = req.body.mdp ? req.body.mdp :"default"
      bcrypt.hash(unhasheMdp, 10)
      .then(async(hash)=>{
        const user = await prisma.user.create({
            data: {
              nom: req.body.nom,
              prenom: req.body.prenom,
              email: req.body.email,
              role: req.body.role,
              mdp: hash,
              numTel: req.body.numTel,
              chauffeur: {
                create: {
                  email:req.body.email,
                  client: req.body.client,
                  siteName: req.body.siteName,
                  region: req.body.region
                }
              },
              profile: {
                create: {
                  date_de_naissance: req.body.date_de_naissance,
                  typeContrat: req.body.typeContrat,
                  dateEmbauche: req.body.dateEmbauche,
                  creerPar: req.body.creerPar,
                  permisConduire: req.body.permisConduire,
                  photo: req.body.photo,
                }
              }
            }
        })
    
        console.log(hash,user)

        return res.status(200).json(user)
      })
      .catch((error)=>res.status(404).json({error: next(error)}))
    } catch (error) {
     return res.status(404).json({error:next(error)})
    }
  }

  exports.editChauffeur = async (req, res, next) => {
    try {
        const { id } = req.params
        const chauffeur = await prisma.chauffeur.update({
            where: { id: Number(id) },
            data: {
              email:req.body.email,
              client: req.body.client,
              siteName: req.body.siteName,
              region: req.body.region
            },
            include: {
              user: true,
            }
        })
        const user = await prisma.user.update({
          where:{ id: chauffeur.userId },
          data:{
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            role: req.body.role,
            numTel: req.body.numTel,
            profile: {
              update: {
                date_de_naissance: req.body.date_de_naissance,
                typeContrat: req.body.typeContrat,
                dateEmbauche: req.body.dateEmbauche,
                creerPar: req.body.creerPar,
                permisConduire: req.body.permisConduire,
                photo: req.body.photo,
              }
            }
          }
        })
        console.log(req.body.numTel,user)
        res.status(200).json("Le chaufffeur a été modifié avec succès")
    } catch (error) {
        res.status(404).json({ error: "modification"})
    }
}
exports.getAdminSinistres = async (req, res, next) => {
    try {
      const { id } = req.params
      const admin = await prisma.adminClient.findUnique({
        where: {userId: Number(id)}
      })
      const sinis = await prisma.declarationSinistre.findMany({
        where:{
          NUMERO_CLIENT : admin.clientID.toString()
          }
        })

        res.status(200).json(sinis)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
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

exports.deleteAdmin = async (req, res, next) => {
  try {
      const { id } = req.params
      const admin = await prisma.adminClient.delete({
          where: { id: parseInt(id) },
      })
      res.status(200).json(admin)
  } catch (error) {
      res.status(404).json({ error: error })
  }
}
  
exports.addClient = async (req, res, next) => {
    try {
        const adminClient = await prisma.adminClient.update({
            where: { userId: Number(req.body.id) },
            data: {
                clientID: req.body.clientID
            }
        })
        // const result= await forgotPassword(req.body.id)
        // if(result.error){
        // return {error:"email n'a pas pu etre envoyé"}
        // }
        return res.status(201).json({adminClient})
    } catch (error) {
       return res.status(404).json({ error: error })
        // next(error)
    }
}

