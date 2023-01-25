const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const excelToJson = require('convert-excel-to-json');
var XLSX = require("xlsx");
const fse =require("fs-extra")

exports.getSinistres = async (req, res, next) => {
    try {
        const sinistres = await prisma.sinistre.findMany({
            orderBy: 
                {
                    id: 'desc',
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
        next(error)
        // res.status(404).json({ error: error })
    }
}

exports.getDecSinistres = async (req, res, next) => {
    try {
        const sinistres = await prisma.declarationSinistre.findMany({})
        res.json(sinistres)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
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
        const { id } = req.params
        const sinistre = await prisma.sinistre.deleteMany({})
        return res.status(200).json({ message: "tous les sinistres ont été supprimés" })
    } catch (error) {
        res.status(404).json({ error: error })
    }
}

const getDate=(date)=>{
    let arr =[]
    arr =date.split(' ')
    const month= new Date(arr).getMonth()
    const month1= new Date(date).getMonth()
    const d=arr[2] + "-0" + String(month1+1)  + "-" + arr[3]
    console.log('arr',month,'date',month1)
    return d
}
const datesArr= ["DATE_RECEPTION","DATE_SURVENANCE","PREMIERE_MEC","DATE_MISSIONNEMENT",
"DATE_EXPERTISE","DATE_PRE_RAPPORT","DATE PRE_RAPPORT","DATE_RAPPORT_DEFINITIF","DATE_CLOTURE"]

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
            console.log("arr",arr.length)
            // res.status(200).json({arr})
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
                // res.status(404).json({ error: error })
                return next(error)
            }

        } else {
        return res.status(400).json({ error: "no file" })
        }
    }

    
    exports.getFiltredData = async (req, res, next) => {
        let obj={}
        req.body.map((el,id)=>{
            if(el.value !== ""){
                obj ={...obj, [el.name]: el.value}
            }
        })
        console.log(obj)

        try {
            const sinistres = await prisma.declarationSinistre.findMany({
                where:{
                    ANNEE: obj.ANNEE,
                    DATE_SURVENANCE: obj.DATE_SURVENANCE,
                    REGION: obj.REGION ,
                    SOCIETE: obj.SOCIETE,
                }
            })
            res.json(sinistres)
        } catch (error) {
            res.status(404).json({ error: error })
            // next(error)
        }
    }
