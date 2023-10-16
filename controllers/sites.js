const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getSites = async(req, res, next) => {
    try {        
        const sites= await prisma.site.findMany({
            include: {
                Societe: {
                    include: {
                        client:true,
                        objectifs:true
                    }
                },
            }
        })
        return res.status(200).json(sites)
    } catch (error) {
        next(error)
    }
}
exports.getSite = async(req, res, next) => {
    try {        
        const sites= await prisma.site.findUnique({
            where: {id : Number(req.params.id)},
            include: {
                Societe: {
                    include: {
                        region: true,
                        country: true
                    }
                }
            }
        })
        return res.status(200).json(sites)
    } catch (error) {
        next(error)
    }
}

exports.getUserSites = async(req, res, next) => {
    try {        
        const user = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                manager: {
                    select:{
                        societes:  {
                            select: {
                                societe:{
                                    select: {
                                        sites: {
                                            include: {Societe:true,objectifs:true}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                admin_client: {
                    select: {
                        client:{
                            select: {
                                societes: {
                                    select: {
                                        sites: {
                                            include: {Societe:true,objectifs:true}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            }
        })

    var filteredSites = []
    if(user.role === "manager"){
        console.log(user.manager?.societes)
        // filteredSites = user.manager?.societes?.sites
        user.manager?.societes?.map(soc=>{
            console.log(soc)
            soc.societe.sites.map(site=>  filteredSites.push(site))
        })
    }else if(user.role === "client_admin"){
        console.log(user.admin_client)
        user.admin_client?.client?.societes?.map(soc=>{
            console.log(soc)
            soc.sites.map(site=>  filteredSites.push(site))
        })
    } else {
        const sites= await prisma.site.findMany({
            include: {
                Societe: true
            }
        })
        filteredSites = sites
    }
   
        return res.status(200).json(filteredSites)
    } catch (error) {
        next(error)
    }
}

exports.connectSites = async (req, res, next) => {
    try {
        const arr = []
        req.body.societes.map((el,id)=>{
            arr.push({
                societe: {
                    connect: {
                        id: Number(el)
                    }
                }
            })
        })
        console.log(arr)
        const managers = await prisma.manager.create({
            data: {
                clientId: Number(req.body.clientId),
                user: {
                    connect:{
                    id:req.body.id,
                    }
                },
                societes: {
                    create: arr
                }
            }
        })
        res.status(200).json(managers)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}

exports.createSite = async (req, res, next) => {
    try {
        const siteData = {...req.body}
     const site= await prisma.site.create({
        data: {
            ...siteData,
            clientId: Number(req.body.clientId),
            SocieteID: Number(req.body.SocieteID)
        }
     })
     res.status(200).json(site)
     
    } catch (error) {
        next(error)
    //   res.status(404).json({error})
    }
  }
exports.editSite = async (req, res, next) => {
    const { id } = req.params
    const site = await prisma.site.findUnique({
        where: {id: Number(id)}
    })
    console.log(site)
    try {
        const siteData = {
            ...site,
            ...req.body,
        }
        const upSite= await prisma.site.update({
        where: { id: Number(id) },
        data: {
            ...siteData,
            clientId: Number(req.body.clientId),
            SocieteID: Number(req.body.SocieteID)
        }
     })
     res.status(200).json(upSite)
    } catch (error) {
        next(error)
    //   res.status(404).json({error})
    }
  }



exports.deleteSite = async (req, res, next) => {
    try {
        const { id } = req.params
        const site = await prisma.site.delete({
            where: { id: parseInt(id) },
        })
        res.status(200).json(site)
    } catch (error) {
        next(error)
        // res.status(404).json({ error: error })
    }
  }