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
        res.json(sinistres)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}
exports.getDecSinistres = async (req, res, next) => {
    try {
        const sinistres = await prisma.declarationSinistre.findMany({})
        res.json(sinistres)
    } catch (error) {
        res.json({ error: error })
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
        // res.status(404).json({ error: error })
        next(error)
    }
}
exports.deleteDecSinistre = async (req, res, next) => {
    try {
        const { id } = req.params
        const sinistre = await prisma.declarationSinistre.delete({
            where: { Dossier: parseInt(id) },
        })
        deleteSinis(id)
        return res.status(200).json(sinistre)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
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
        // res.status(404).json({ error: error })
        next(error)
    }
}
