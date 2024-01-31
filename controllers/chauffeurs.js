const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const send_mail = require("../utility/sendEmail");
const { copySync } = require('fs-extra');

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
exports.getUserChauffeurs = async (req, res, next) => {
    try {
        const user= await prisma.user.findUnique({
              where: {id: Number(req.params.id)},
              include: {
                  manager: {
                      include: {
                          client: true,
                          societes: {
                              include: {
                                  societe: {
                                      include: {
                                          sites: true
                                      }
                                  }
                              }
                          }
                      }
                  },
                  admin_client: {
                      include: {
                          client: true
                      }
                  },
              }
          })
          //  console.log(user)
      
          if(user.role == "client_admin"){
              const chauffeurs = await prisma.chauffeur.findMany({
                  where: {
                      clientId: user.admin_client.clientID
                  },
                  include: {
                    user: {
                      include: {
                        profile: true
                      }
                    }
                  },
              })
              return   res.status(200).json(chauffeurs)
          } else if(user.role == "manager"){
              const societesIds=[]
              user.manager.societes.map((soc)=>{
                societesIds.push(String(soc.societe.id))
              })
              console.log('societesIds',societesIds)
              const chauffeurs = await prisma.chauffeur.findMany({
                  where: {
                      societe: {
                        in: societesIds,
                      },
                  },
                  include: {
                    user: {
                      include: {
                        profile: true
                      }
                    }
                  },
              })
              console.log(chauffeurs)
              return   res.status(200).json(chauffeurs)
          } else if(user.role == "super_admin"){
              const chauffeurs = await prisma.chauffeur.findMany({
                include: {
                  user: {
                    include: {
                      profile: true
                    }
                  }
                },
              })
              return   res.status(200).json(chauffeurs)
          }
     
    } catch (error) {
        res.status(404).json({ error: next(error) })
    }
}
const getChauffeursForUser = async(id)=>{

}
exports.getToExport = async (req, res, next) => {
  try {
      const clients= await prisma.client.findMany()
      const regions= await prisma.region.findMany()
      const sites= await prisma.site.findMany()
      const arr = await getChauffeursForUser(req.params.id)
      const chauffeurs=[]
      arr.map((el)=>{
        const obj= {
          ...el, 
          nomClient: clients.find(cli=> cli.id == parseInt(el.client)).nomClient,
          nomRegion: regions.find(cli=> cli.id == parseInt(el.region)).name,
          nomSite: sites.find(cli=> cli.id == parseInt(el.siteName)).nom,
        }
        chauffeurs.push(obj)
      })
        res.status(200).json(chauffeurs)
    } catch (error) {
        res.status(404).json({ error: error })
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
                  client: String(req.body.client),
                  region: req.body.region,
                  societe: req.body.societe,
                  siteName: req.body.siteName,
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
              region: req.body.region,
              societe: req.body.societe,
              siteName: req.body.siteName,
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

