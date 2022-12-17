const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var XLSX = require("xlsx");


exports.getSinistres = async (req, res, next) => {
    try {
        const sinistres = await prisma.sinistre.findMany({
            include: {
                declarationSinistre: true
            }
        })
        // const arr = []
        // for (let id in sinistres) {
        //     console.log(id)
        //     let sins = { ...sinistres[id] }
        //     delete sins.declarationSinistre
        //     sins = { ...sins, ...sinistres[id].declarationSinistre }
        //     arr.push(sins)
        // }
        res.json(sinistres)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
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
        res.json(sinis)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}

exports.deleteSinistre = async (req, res, next) => {
    try {
        const { id } = req.params
        const sinistre = await prisma.sinistre.delete({
            where: { id: parseInt(id) },
        })
        res.json(sinistre)
    } catch (error) {
        res.json({ error: error })
    }
}
