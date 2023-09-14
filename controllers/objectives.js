const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getClientId = async (name)=>{
    try {  
        console.log(name)
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
        return parseInt(societe.id)
    } catch (error) {
        next(error)
    }
}
const getRegionId = async (name)=>{
    try {
        const region = await prisma.region.findFirst({
            where:{name:name}
        }) 
        console.log('name',name,region)
        return parseInt(region.id)
    } catch (error) {
        next(error)   
    }
}
const getSiteId = async (name)=>{
    try {
        const region = await prisma.site.findFirst({
            where:{nom:name}
        }) 
        return parseInt(region.id)
    } catch (error) {
        next(error)   
    }
}
exports.getByName = async (req, res, next) => {
    try {
        console.log(req.body)
        let obj 
        let resFound =false
        if(req.body.type == 'Client'){
            const id=parseInt(req.body.id)
            obj= { ClientID: id}
        }
        else if(req.body.type == 'Société'){
            const id= await  getSocieteId(req.body.id )
            obj= { SocieteID: id}
        } 
        else if(req.body.type == 'Région'){
            const id= await  getRegionId(req.body.id )
            obj= { regionId: id }
        } 
        else if(req.body.type == 'Site'){
            const id= await  getSiteId(req.body.id )
            obj= { siteId: id }
        } 
        console.log(obj,req.body.type)
        const objectifs = await prisma.objectif.findMany({
            where: obj
        })
        if(obj){
            res.status(200).json(objectifs)
        } else {
        //   return  next(error)
       return res.status(404).json({ error: 'not find' })

        }
    } catch (error) {
        // return next(error)
        res.status(404).json({ error: 'not find' })
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
            const filtre = {...obj}
            delete filtre.value
            console.log('filtre', filtre)

            const yearExist = await prisma.objectif.findFirst({
                where: filtre
            })
            console.log('year', yearExist)
            if (yearExist){
            return res.status(404).json({ error: `Il existe déjà un objectif pour l'année ${req.body.data.year} !` })
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
        return res.status(404).json({ error: `Il existe déjà un objectif pour l'année ${req.body.data.year} !` })
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

exports.getFiltred = async (req, res, next) => {
    try {
        let obj ={}
        if(req.body.year){
            obj= {...obj, year: (req.body.year).toString() }
        }
        if(req.body?.filter && req.body?.id){
            let elid
            switch (req.body.filter) {
                case "ClientID": elid = parseInt(req.body.id);
                    break;
                case "regionId": elid = await getRegionId(req.body.id);
                    break;
                case "SocieteID": elid =await getSocieteId(req.body.id);
                    break;
                case "siteId": elid =await getSocieteId(req.body.id);
                    break;
            }
            console.log(elid)
            if(elid){
                obj= {...obj, [req.body.filter]: elid}
            } else {
                res.status(200).json("not found")
            }
        }
        const objectifs = await prisma.objectif.findMany({
          where:obj
        })
        
        let result = 0
        if (req.body.type == "somme"){
            let s=0
            objectifs.map((obj)=>{
                s=s+ parseInt(obj.value)
            })
            result = s
        } 
        else if (objectifs.length >0) {
           result= objectifs[0].value
        } else {
            result = 0
        }
        console.log(result,req.body)
        res.status(200).json(parseInt(result))
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}