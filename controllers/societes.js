const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


exports.getSocietes = async (req, res, next) => {
    try {
        const societes = await prisma.societe.findMany({
            include: {
                contrat: true,
                country: true,
                region:true,
                managers: {
                    select:{
                        manager:true
                    }
                }
            }
        })
        res.status(200).json(societes)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}
exports.getCountries = async(req, res, next) => {
    try {        
        const countries= await prisma.country.findMany({
            include: {
                regions: true
            }
        })
        return res.status(200).json(countries)
    } catch (error) {
        next(error)
    }
}
exports.getRegions = async(req, res, next) => {
    try {        
        const regions= await prisma.region.findMany()
        return res.status(200).json(regions)
    } catch (error) {
        next(error)
    }
}
exports.getSociete = async (req, res, next) => {
    try {
        const societe = await prisma.societe.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                contrat: true,
                country: true,
                region: true,
                client: true
            }
        })
        res.status(200).json(societe)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}

exports.getCountry = async (req, res, next) => {
    try {
        const country = await prisma.country.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                regions: true
            }
        })
        res.status(200).json(country)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}

exports.addSociete = async (req, res, next) => {
    try {
        const societe = await prisma.societe.create({
            data: req.body
        })
        res.status(200).json(societe)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
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
    }
}

exports.deleteSociete = async (req, res, next) => {
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
