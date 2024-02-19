const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const send_mail = require("../utility/sendEmail");
const excelToJson = require('convert-excel-to-json');
const fse =require("fs-extra")

exports.getChauffeurs = async (req, res, next) => {
    try {
        const chauffeurs = await prisma.chauffeur.findMany({})
        const arr= []
        res.status(200).json(chauffeurs)
    } catch (error) {
        res.status(404).json({ error: next(error) })
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
      
          if(user.role == "client_admin"){
              const chauffeurs = await prisma.chauffeur.findMany({
                  where: {
                      clientId: user.admin_client.clientID
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
                      societeId: {
                        in: societesIds,
                      },
                  },
              })
              return   res.status(200).json(chauffeurs)
          } else if(user.role == "super_admin"){
              const chauffeurs = await prisma.chauffeur.findMany({})
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
      if(arr.length >0){
        arr.map((el)=>{
          const obj= {
            ...el, 
            nomClient: el.client && clients.find(cli=> cli.id == parseInt(el.client)).nomClient,
            nomRegion: el.region && regions.find(cli=> cli.id == parseInt(el.region)).name,
            nomSociete: el.societe && societes.find(cli=> cli.id == parseInt(el.societe)).name,
            nomSite: el.siteName && sites.find(cli=> cli.id == parseInt(el.siteName)).nom,
          }
          chauffeurs.push(obj)
        })
        if(chauffeurs.length>0){
          return  res.status(200).json(chauffeurs)
        }else{
          return  res.status(404).json({ error: next(error) })
        }
      }
    } catch (error) {
      return  res.status(404).json({ error: next(error) })
    }
}
exports.getChauffeur = async (req, res, next) => {
    try {
      const { id } = req.params
        const chaffeur = await prisma.chauffeur.findUnique({
          where:{
            userId: parseInt(id)
          }
        })
        res.status(200).json(chaffeur)
    } catch (error) {
        res.status(404).json({ error: next(error) })
    }
}
exports.addChauffeur = async(req, res, next) => {
    try {
      const emailExist = await prisma.chauffeur.findUnique({where:{email: req.body.email}})
      if(!emailExist){
        const chauffeur = await prisma.chauffeur.create({
          data: {
            ...req.body
          }
        })
        res.status(200).json(chauffeur)
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
            data: {...req.body}
        })
        return res.status(200).json("Le chaufffeur a été modifié avec succès")
    } catch (error) {
        return res.status(404).json({ error: next(error)})
    }
}

exports.deleteChauffeur = async (req, res, next) => {
  try {
      const { id } = req.params
      const admin = await prisma.chauffeur.delete({
          where: { id: parseInt(id) },
      })
      return res.status(200).json("Le chaufffeur a été supprimé avec succès") 
  } catch (error) {
      return res.status(404).json({ error: error })
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
        }
      })
      const arr=excelData.MySheet1
      // console.log('arr before',arr)
      arr.map((el) => {
        delete el.id
        if(el["clientName"] ){
          const client= clients.find(cli => cli.nomClient == el["clientName"] )
          // console.log('client',client,client['id'], el["clientName"])
          if(client){
            el["client"]= client.id
          } else {
            el["client"]= null
          }
        }
        if(el["regionName"] ){
          const region= regions.find(reg => reg.name == el["regionName"] )
          if (region) {
            el["region"] = region.id;
          } else {
              el["region"] = null; // Set to null if region not found
          }
        }
        if(el["societeName"] ){
          const societe= societes.find(soc => soc.name == el["societeName"] )
          if (societe) {
            el["societe"] = societe.id;
          } else {
              el["societe"] = null; // Set to null if societe not found
          }
        }
        if(el["siteName"] ){
          const site= sites.find(site => site.nom == el["siteName"] )
          if (site) {
            el["site"] = site.id;
          } else {
              el["site"] = null; // Set to null if site not found
          }
        }
        for(let key in el){
            if(typeof el[key] === 'number' || typeof el[key] !== 'float' ){
                el[key] = el[key]?.toString()
            }
            if(datesArr.indexOf(el[key]) !== -1){
                el[key]= getDate(el[key])
            }
            if(el[key] == ''){
              el[key] = null
            }
        }
        Object.keys(el).map((element)=>{
            if((datesArr.indexOf(element) !== -1)  && (el[element]?.length > 10)){
                el[element]= getDate(el[element])
              }               
        })
      })
      // console.log('after arr',arr)
      // const chauffeur = await prisma.chauffeur.deleteMany({})
      arr.map(async (el,id) => {
        const emailExist = await prisma.chauffeur.findUnique({where:{email: el.email}})
        if(!emailExist){
          try {
            const chauffeur= await prisma.chauffeur.create({
              data: {...el}
            })
            console.log('chauffeur',chauffeur)
          } catch (error) {
            return res.status(404).json({error: next(error)})
          }
        }
      })
      fse.remove(filePath)
      return res.status(200).json("le fichier excel est bien importé")
  } else {
    return res.status(400).json({ error: "no file" })
  }
}

