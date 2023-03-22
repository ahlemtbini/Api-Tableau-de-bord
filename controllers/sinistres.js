const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const excelToJson = require('convert-excel-to-json');
var XLSX = require("xlsx");
const fse =require("fs-extra")

exports.getSinistres = async (req, res, next) => {
    try {
        // const sinistres = await prisma.$queryRaw`
        // select sins.*
        // from "Sinistre" sins
        // join "DeclarationSinistre" dec on dec.DOSSIER = sinis."id"
        // order by dec.DATE_SURVENANCE desc
        // `
        const sinistres = await prisma.sinistre.findMany({
            orderBy: 
                {
                    id: 'asc',
                },
            include: {
                declarationSinistre: true
            }
        })
        res.json(sinistres)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}
exports.getSinistre = async (req, res, next) => {
    try {
        const dec = await prisma.declarationSinistre.findUnique({
            where: { id: req.params.id },
        })
        res.json(dec)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}

exports.addSinistre = async (req, res, next) => {
    try {
        const sinis = await prisma.sinistre.create({
            data: {
                ...req.body.sinistre,
                declarationSinistre: {
                    create: {
                        ...req.body.decSinistre
                    }
                }
            },
            include: {
                declarationSinistre: true,
            }
        })
        return res.json(sinis)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}

exports.deleteSinistre = async (req, res, next) => {
    try {
        const { id } = req.params
        const sinis = await prisma.sinistre.delete({
            where: { id: parseInt(id) },
        })
        return res.status(200).json(sinis)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}
exports.editSinistre = async (req, res, next) => {
    try {
        const { id } = req.params
        console.log(id, req.body)
        const sinis = await prisma.declarationSinistre.update({
            where: { DOSSIER: parseInt(id) },
            data: req.body
        })
        return res.status(200).json(sinis)
    } catch (error) {
        // next(error)
        res.status(404).json({ error: error })
    }
}


const dateToNumber=(a)=>{
 return ((a.split('-')[0].length) === 4) ? a.split('-')[0] + a.split('-')[1] + a.split('-')[2] : a.split('-')[2] + a.split('-')[1] + a.split('-')[0]
}
const compareDatesFr =(a,b)=>{
    const el1 = Number(dateToNumber(a))
    const el2 = Number(dateToNumber(b))
    if(el2 > el1){
        return true
    } 
    return false
}


exports.getDecSinistres = async (req, res, next) => {
    try {
        const sin = await prisma.declarationSinistre.findMany({orderBy:{DATE_SURVENANCE: 'desc'}})
        let sinistres = [...sin]
            let n=sinistres.length
             for (let i = 0; i < n-1; i++){
                 for (let j = 0; j< n-i-1; j++) {
                    if (sinistres[j+1].DATE_SURVENANCE && sinistres[j].DATE_SURVENANCE && compareDatesFr(sinistres[j].DATE_SURVENANCE,sinistres[j+1].DATE_SURVENANCE )){
                        const t=sinistres[j+1]
                        sinistres[j+1]=sinistres[j]
                        sinistres[j]=t
                    }
                }
            }
        res.json(sinistres)
    } catch (error) {
        // res.status(404).json({ error: error })
        console.log(error)
        next(error)
    }
}

exports.deleteDecSinistre = async (req, res, next) => {
    try {
        const { id } = req.params
        const sinistre = await prisma.declarationSinistre.delete({
            where: { DOSSIER: parseInt(id) },
        })
        deleteSinis(id)
        return res.status(200).json(sinistre)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}
const deleteSinis = async (id) => {
    try {
        const { id } = req.params
        const sinistre = await prisma.sinistre.delete({
            where: { id: parseInt(id) },

        })
        return { res: "success" }
    } catch (error) {
        res.status(404).json({ error: error })
    }
}
exports.deleteAll = async (req, res, next) => {
    try {
        const sinistre = await prisma.sinistre.deleteMany({})
        return res.status(200).json({ message: "tous les sinistres ont été supprimés" })
    } catch (error) {
        res.status(404).json({ error: error })
    }
}

const getDate=(date)=>{
    let arr =[]
    arr =date.split(' ')
    console.log(date)
    const month= new Date(arr).getMonth()
    const month1= new Date(date).getMonth()
    let d=""
    if(String(month1+1) <10 ){
         d=arr[2] + "-0" + String(month1+1)  + "-" + arr[3]
    }else{
        d=arr[2] + "-" + String(month1+1)  + "-" + arr[3]
    }
    // console.log('arr',month,'date',month1)
    return d
}
const datesArr= ["DATE_RECEPTION","DATE_SURVENANCE","PREMIERE_MEC","DATE_MISSIONNEMENT",
"DATE_EXPERTISE","DATE_PRE_RAPPORT","DATE PRE_RAPPORT","DATE_RAPPORT_DEFINITIF","DATE_CLOTURE"]
exports.reparerDateFormat = async (req, res, next) => {
    try {
        const sin = await prisma.declarationSinistre.findMany({})
        const arr=[...sin]
        arr.map(async (el,id) => {
            for(let key in el){
                if( datesArr.includes(key)){
                    if(el[key] && el[key]?.split('-')[0].length== 4 ){
                        console.log(el[key])
                        el[key]= el[key]?.split('-')[2]+'-'+el[key]?.split('-')[1]+'-'+ el[key].split('-')[0]
                        try {
                            const sinis = await prisma.declarationSinistre.update({
                                where: { DOSSIER: parseInt(el.DOSSIER) },
                                data: el
                            })
                            
                        } catch (error) {
                            console.log(error)
                            next(error)
                        }
                    }
                 }
            }
        })
        res.json('format date modifié')
    } catch (error) {
        // res.status(404).json({ error: error })
        console.log(error)
        next(error)
    }
}

exports.importExcel = async (req, res, next) => {
    if (req.files[0]) {
        const fName = req.files[0].filename;
        excel = (`${req.protocol}://${req.get('host')}/api/documents/${fName}`)
          var filePath = './documents/' + fName
            console.log(filePath)
          const excelData = excelToJson({
            sourceFile: filePath,
            header: {rows:1,},
            columnToKey:{
              "*": "{{columnHeader}}",
            },
          })
    
          const arr=excelData.MySheet1
          
          arr.map((el) => {
                if(el["NUMERO CLIENT"] ){
                  el["NUMERO_CLIENT"]= el["NUMERO CLIENT"] ? el["NUMERO CLIENT"] : ""
                  delete el["NUMERO CLIENT"]
                }
                if(el["DATE PRE_RAPPORT"] ){
                  el["DATE_PRE_RAPPORT"]= el["DATE PRE_RAPPORT"] ? el["DATE PRE_RAPPORT"]: ""
                  delete el["DATE PRE_RAPPORT"]
                }
                delete el.DOSSIER
                for(let key in el){
                    if(typeof el[key] === 'number' || typeof el[key] !== 'float' ){
                        el[key] = el[key].toString()
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
            // console.log("arr",arr.length)
            // res.status(200).json({arr})
            const sinistre = await prisma.sinistre.deleteMany({})

            try {
                arr.map(async (el,id) => {
                    const sinis = await prisma.sinistre.create({
                        data: {
                            creatorId: "1",
                            creatorRole: "super_admin",
                            declarationSinistre: {
                                create: {
                                    ...el
                                }
                            }
                        },
                        // skipDuplicates: false,
                        include: {
                            declarationSinistre: true,
                        }
                    })
                })
                    fse.remove(filePath)
                return res.status(200).json("le fichier excel est bien importé")
            } catch (error) {
                res.status(404).json({ error: error })
                // return next(error)
            }

        } else {
        return res.status(400).json({ error: "no file" })
        }
    }

    
    exports.getFiltredData =  async(req, res, next) => {
        let obj={}
        req.body.map((el,id)=>{
            if(el.value.length > 0){
                if(el.name=== "DATE_SURVENANCE"){
                    const arr = []
                    el.value.map((val)=>{
                        arr.push({[el.name]: {contains: `-${val}-`}})
                    })
                    console.log(arr)
                    obj ={...obj, OR: arr}
                } else {
                    obj ={...obj, [el.name]: {in: el.value}}
                }
            }
        })
         console.log(obj)
        try {
            const sinistres = await prisma.declarationSinistre.findMany({
                where: obj
            })
        // console.log(sinistres)
            
            res.json(sinistres)
        } catch (error) {
            res.status(404).json({ error: "requete non valide" })
            // next(error)
        }
    }
exports.saveDocuments =  async (req, res, next) => {
    try {
        console.log(req.files,'sdsq')
        let array = []
        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                const fName = req.files[i].filename;
                array.push(`${req.protocol}://${req.get('host')}/api/documents/${fName}`)
            }
        }
        return res.status(201).json(array)
    } catch (error) {
        return res.status(404).json({error})
    }
}