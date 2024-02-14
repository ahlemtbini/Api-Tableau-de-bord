const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const send_mail = require("../utility/sendEmail");
const excelToJson = require('convert-excel-to-json');
const fse =require("fs-extra")

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
const getChauffeursForUser = async (id) => {
    try {
        const user= await prisma.user.findUnique({
              where: {id: Number(id)},
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
              return   chauffeurs
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
              return chauffeurs
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
              return chauffeurs
          }
     
    } catch (error) {
       return null
    }
}

exports.getToExport = async (req, res, next) => {
  try {
      const clients= await prisma.client.findMany()
      const regions= await prisma.region.findMany()
      const sites= await prisma.site.findMany()
      const societes= await prisma.societe.findMany()
      const arr = await getChauffeursForUser(req.params.id)
      const chauffeurs=[]
      arr.map((el)=>{
        const obj= {
          ...el, 
          nomClient: clients.find(cli=> cli.id == parseInt(el.client)).nomClient,
          nomRegion: el.region && regions.find(cli=> cli.id == parseInt(el.region)).name,
          nomSociete: el.societe && societes.find(cli=> cli.id == parseInt(el.societe)).name,
          nomSite: el.siteName && sites.find(cli=> cli.id == parseInt(el.siteName)).nom,
        }
        chauffeurs.push(obj)
      })
        res.status(200).json(chauffeurs)
    } catch (error) {
        res.status(404).json({ error: next(error) })
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
exports.addChauffeur = async(req, res, next) => {
    try {
      const emailExist = await prisma.user.findUnique({where:{email: req.body.email}})
      if(!emailExist){
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
      } else {
        return res.status(404).json({error: "L'email du chauffeur existe déja"})
      }
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
const getClients = async()=>{
  const res= await prisma.client.findMany({})
  return res
}
const getRegions = async()=>{
  const res= await prisma.region.findMany({})
  return res
}
const getSocietes = async()=>{
  const res= await prisma.societe.findMany({})
  return res
}
const getSites = async()=>{
  const res= await prisma.site.findMany({})
  return res
}

exports.importChauffeurs = async (req, res, next) => {
  const datesArr=["dateEmbauche","date_de_naissance"]
  const clients= await  getClients()
  const regions= await getRegions()
  const societes= await getSocietes()
  const sites= await getSites()
  if (req.files[0]) {
      const fName = req.files[0].filename;
      excel = (`${req.protocol}://${req.get('host')}/api/documents/${fName}`)
      var filePath = './documents/' + fName
      const excelData = excelToJson({
        sourceFile: filePath,
        header: {rows:1,},
        columnToKey:{
          "*": "{{columnHeader}}",
        },
      })
      const arr=excelData.MySheet1
      // console.log('arr before',arr)

      arr.map((el) => {
            if(el["nomClient"] ){
              const client= clients.filter(cli => cli.nomClient == el["nomClient"] )
              console.log('client',client)
              el["nomClient"]= client.id
              // delete el["nomClient"]
            }
            if(el["nomRegion"] ){
              const region= regions.filter(reg => reg.name == el["nomRegion"] )
              el["nomRegion"]= region.id
              // delete el["nomRegion"]
            }
            if(el["nomSociete"] ){
              const societe= societes.filter(soc => soc.name == el["nomSociete"] )
              el["nomSociete"]= societe.id
              // delete el["nomSociete"]
            }
            if(el["nomSite"] ){
              const site= sites.filter(site => site.nom == el["nomSite"] )
              el["nomSite"]= site.id
              // delete el["nomSite"]
            }
            delete el.id
            delete el.aciveInactive
            delete el.userId

            for(let key in el){
                if(typeof el[key] === 'number' || typeof el[key] !== 'float' ){
                    el[key] = el[key]?.toString()
                }
                if(datesArr.indexOf(el[key]) !== -1){
                    el[key]= getDate(el[key])
                }
            }
            Object.keys(el).map((element)=>{
                if((datesArr.indexOf(element) !== -1)  && (el[element].length > 10)){
                    el[element]= getDate(el[element])
                  }               
            })
  
        })
      console.log('arr',arr)

      // res.status(200).json({arr})
      const chauffeur = await prisma.chauffeur.deleteMany({})
      arr.map(async (el,id) => {
        try {
          const emailExist = await prisma.user.findUnique({where:{email: el.email}})
          if(!emailExist){
            const unhasheMdp = "default"
            bcrypt.hash(unhasheMdp, 10)
            .then(async(hash)=>{
              const user = await prisma.user.create({
                  data: {
                    nom: el.nom,
                    prenom: el.prenom,
                    email: el.email,
                    role: "chauffeur",
                    mdp: hash,
                    numTel: el.numTel,
                    chauffeur: {
                      create: {
                        email:el.email,
                        client: String(el.nomClient),
                        region: el.nomRegion,
                        societe: el.nomSociete,
                        siteName: el.nomSite,
                      }
                    },
                    profile: {
                      create: {
                        date_de_naissance: el.date_de_naissance,
                        typeContrat: el.typeContrat,
                        dateEmbauche: el.dateEmbauche,
                        creerPar: "super_admin",
                      }
                    }
                  }
              })
              console.log(hash,user)
            })
            .catch((error)=>res.status(404).json({error: next(error)}))
          } else {
            return res.status(404).json({error: "L'email du chauffeur existe déja"})
          }
        } catch (error) {
         return res.status(404).json({error:next(error)})
        }
      })
      fse.remove(filePath)
      return res.status(200).json("le fichier excel est bien importé")
  } else {
  return res.status(400).json({ error: "no file" })
  }
}

