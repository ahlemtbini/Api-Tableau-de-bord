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
        res.status(404).json({ error: error })
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
            where: { Dossier: parseInt(id) },
            data: req.body
        })
        return res.status(200).json(sinis)
    } catch (error) {
        res.status(404).json({ error: error })
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
            where: { Dossier: parseInt(id) },
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

exports.importExcel = async (req, res, next) => {
    try {
        req.body.map(async (el) => {
            const sinis = await prisma.sinistre.create({
                data: {
                    ...el.sinistre,
                    declarationSinistre: {
                        create: {
                            ...el.decSinistre
                        }
                    }
                },
                // skipDuplicates: false,
                include: {
                    declarationSinistre: true,
                }
            })
        })
        return res.status(200).json("le fichier excel est bien importé")
    } catch (error) {
        // res.status(404).json({ error: error })
        return next(error)
    }
}