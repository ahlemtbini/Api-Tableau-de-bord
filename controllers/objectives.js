const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



const getClientId = async (name)=>{
    try {
        const client = await prisma.client.findFirst({
            where:{nomClient:name}
        }) 
        return client.id
    } catch (error) {
        next(error)        
    }
}
const getSocieteId = async (name)=>{
    try {
        const societe = await prisma.societe.findFirst({
            where:{name:name}
        }) 
        return societe.id
    } catch (error) {
        next(error)
    }
}
const getRegionId = async (name)=>{
    try {
        const region = await prisma.region.findFirst({
            where:{name:name}
        }) 
        return region.id
    } catch (error) {
        next(error)   
    }
}
exports.getByName = async (req, res, next) => {
    try {
        let obj ={}
        let resFound =false
        if(req.body.type == 'client'){
            const id= await getClientId(req.body.id)
            obj= { ClientID: id}
        }
        else if(req.body.type == 'société'){
            const id= await  getSocieteId(req.body.id )
            obj= { SocieteID: id}
        } 
        else if(req.body.type == 'région'){
            obj= { regionId: id }
        } 
        else if(req.body.type == 'site'){
            // console.log(id,req.body.type )
            obj= { siteId: id }
        } 
        // console.log(obj,req.body.type)
        const objectifs = await prisma.objectif.findMany({
            where: obj
        })
        if(obj!== {}){
            res.status(200).json(objectifs)
        } else {
            // next(error)
        }
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}
exports.getAll = async (req, res, next) => {
    try {
        let obj ={}
        if(req.body.type == 'client'){
            obj= {...obj, ClientID: Number(req.body.id) }
        }
        else if(req.body.type == 'societe'){
            obj= {...obj, SocieteID: Number(req.body.id) }
        } 
        else if(req.body.type == 'region'){
            obj= {...obj, regionId: Number(req.body.id) }
        } 
        else if(req.body.type == 'site'){
            obj= {...obj, siteId: Number(req.body.id) }
        } 
        const objectifs = await prisma.objectif.findMany({
          where:obj
        })
        res.status(200).json(objectifs)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}
exports.addObjective = async (req, res, next) => {
    try {
        let obj ={}
        if(req.body.type == 'client'){
            obj= {...req.body.data, ClientID: Number(req.body.id) }
        }
        else if(req.body.type == 'societe'){
            obj= {...req.body.data, SocieteID: Number(req.body.id) }
        } 
        else if(req.body.type == 'region'){
            obj= {...req.body.data, regionId: Number(req.body.id) }
        }
        else if(req.body.type == 'site'){
            obj= {...req.body.data, siteId: Number(req.body.id) }
        }
        const currentYear = new Date().getFullYear();
        if(parseInt(obj.year) == currentYear){
            obj={...obj, current: true}
        }
        const objective = await prisma.objectif.create({
            data: obj
        })
        res.status(200).json(objective)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}
exports.deleteObjective = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        console.log(id,req.params,'test')
        const objective = await prisma.objectif.delete({
            where: {id: id}
        })
        res.status(200).json(objective)
    } catch (error) {
        next(error)
    }
}