const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var XLSX = require("xlsx");

exports.getClients = async (req, res, next) => {
    try {
        const clients = await prisma.client.findMany({
            include: {
                contrats: true,
                countrys: true,
                societes: true
            }
        })
        res.status(200).json(clients)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}
exports.getClient = async (req, res, next) => {
    try {
        const client = await prisma.client.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                contrats: true
            }
        })
        res.status(200).json(client)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}
exports.getUserClient = async (req, res, next) => {
    try {
        const user= await prisma.user.findUnique({
            where: {
                id: Number(req.params.id),
            },
            include:{
                admin_client: {
                    include: {
                        client: true
                    }
                },
                manager: {
                    include: {
                        client: true
                    }
                }
            }
        })
        let client = {}
        if(user.role === "client_admin"){
            client= user.admin_client.client
        }
        if(user.role === "manager"){
            client= user.manager.client
        }
        console.log(client)
        res.status(200).json(client)
    } catch (error) {
        next(error)
        // res.status(404).json({ error: error })
    }
}
exports.getAdminClient = async (req, res, next) => {
    try {
        const client = await prisma.adminClient.findUnique({
            where: { userId: Number(req.params.id) },
            select:{
                client : {
                    include: {
                        contrats:true,
                        countrys: true
                    }
                },
            },
        })
        res.status(200).json({...client.client})
    } catch (error) {
        // next(error)
        res.status(404).json({ error: error })
    }
}
exports.addClient = async (req, res, next) => {
    try {
        const client = await prisma.client.create({
            data: req.body
        })
        res.status(200).json(client)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}
exports.addLogo = async (req, res, next) => {
    let logo = ""
    if (req.files) {
        const fName = req.files[0].filename;
        logo = (`${req.protocol}://${req.get('host')}/api/documents/${fName}`)

        const client = await prisma.client.update({
            where: { id: Number(req.params.id) },
            data: {
                logo: logo
            }
        })
        res.status(200).json(client)
    } else {
        res.status(404).json({ error: error })
    }
}

exports.editClient = async (req, res, next) => {
    try {
        const { id } = req.params
        const client = await prisma.client.update({
            where: { id: Number(id) },
            data: req.body,
        })
        res.status(200).json(client)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}

exports.deleteClient = async (req, res, next) => {
    try {
        const { id } = req.params
        const client = await prisma.client.delete({
            where: { id: parseInt(id) },
        })
        res.status(200).json(client)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}
exports.importAllClients = async (req, res, next) => {
    if (req.files[0]) {

        console.log(req.files)
        console.log(req.file)
        console.log(req.files[0].filename)
    }
    try {
        const data = XLSX.utils.sheet_to_json(req.files[0])
        console.log(data)
        // const clients = await prisma.client.createMany({
        //     data: data,
        //     skipDuplicates: true
        // })
        res.status(200).json(data)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}

exports.addContrat = async (req, res, next) => {
    try {
        const contrat = await prisma.contrat.create({
            data: {...req.body}
        })
        res.status(200).json(contrat)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
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
exports.deleteContrat = async (req, res, next) => {
    try {
        const { id } = req.params
        const contrat = await prisma.contrat.delete({
            where: { id: parseInt(id) },
        })
        res.status(200).json(contrat)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}
exports.addCountry = async (req, res, next) => {
    try {
        const country = await prisma.country.create({
            data: req.body
        })
        res.status(200).json(country)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}

exports.getCountries = async (req, res, next) => {
    try {
        const countries = await prisma.country.findMany({
            where: { clientId: Number(req.params.id) },
            include: {
                regions: true
            }
        })
        res.status(200).json(countries)
    } catch (error) {
        res.status(404).json({ error: error })

    }
}
exports.deleteCountry = async (req, res, next) => {
    try {
        const { id } = req.params
        const country = await prisma.country.delete({
            where: { id: parseInt(id) },
        })
        res.status(200).json(country)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}
exports.addRegion = async (req, res, next) => {
    try {
        const region = await prisma.region.create({
            data: req.body
        })
        res.status(200).json(region)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}

exports.deleteRegion = async (req, res, next) => {
    try {
        const { id } = req.params
        const region = await prisma.region.delete({
            where: { id: parseInt(id) },
        })
        res.status(200).json(region)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}