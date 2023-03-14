const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getSites = async(req, res, next) => {
    try {        
        const sites= await prisma.site.findMany({
            include: {
                Societe: true
            }
        })
        return res.status(200).json(sites)
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
    try {
        const siteData = {...req.body}
        const site= await prisma.site.update({
        where: { id: Number(id) },
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