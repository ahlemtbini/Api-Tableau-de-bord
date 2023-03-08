const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// exports.getSocietes = async (req,res,next)=>{
//     try {      
//         const societes= await prisma.societe.findMany({})
//         return res.status(200).json([
//             {
//                 nom        : 'nom societe',
//                 email      : 'societe@domain.com',
//                 numTel     : '+33 1 23 45 67 89',   
//                 region     : 'Grand Est',
//                 numSiret   : '12345671234567',
//                 creerPar   : 'super_admin',
//                 isActive   : true,
//             },
//         ])
//     } catch (error) {
//         return res.status(404).json({error})
//     }
// }


exports.getSocietes = async (req, res, next) => {
    try {
        const societes = await prisma.societe.findMany({
            include: {
                contrats: true,
            }
        })
        res.status(200).json(societes)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}
exports.getSociete = async (req, res, next) => {
    try {
        const societe = await prisma.societe.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                contrats: true
            }
        })
        res.status(200).json(societe)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}

exports.addSociete = async (req, res, next) => {
    try {
        const societe = await prisma.societe.create({
            data: req.body
        })
        res.status(200).json(societe)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}

exports.editSociete = async (req, res, next) => {
    try {
        const { id } = req.params
        const societe = await prisma.societe.update({
            where: { id: Number(id) },
            data: req.body,
        })
        res.status(200).json(societe)
    } catch (error) {
        res.status(404).json({ error: error })
        next(error)
    }
}
exports.deleteSociete = async (req, res, next) => {
    console.log(req.params.id)
    try {
        const { id } = req.params
        const societe = await prisma.societe.delete({
            where: { id: parseInt(id) },
        })
        res.status(200).json(societe)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}


// exports.importAllSocietes = async (req, res, next) => {
//     if (req.files[0]) {

//         console.log(req.files)
//         console.log(req.file)
//         console.log(req.files[0].filename)
//     }
//     try {
//         const data = XLSX.utils.sheet_to_json(req.files[0])
//         console.log(data)
//         // const clients = await prisma.client.createMany({
//         //     data: data,
//         //     skipDuplicates: true
//         // })
//         res.status(200).json(data)
//     } catch (error) {
//         res.status(404).json({ error: error })
//     }
// }

exports.addContrat = async (req, res, next) => {
    try {
        const contrat = await prisma.contrat.create({
            data: req.body
        })
        res.status(200).json(contrat)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}

exports.getContrats = async (req, res, next) => {
    try {
        const contrats = await prisma.contrat.findMany({
            where: { ClientID: Number(req.params.id) }
        })
        res.status(200).json(contrats)
    } catch (error) {
        res.status(404).json({ error: error })

    }
}
