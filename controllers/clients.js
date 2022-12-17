
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var XLSX = require("xlsx");

exports.getClients = async (req, res, next) => {
    try {
        const clients = await prisma.client.findMany({})
        res.json(clients)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}
exports.getClient = async (req, res, next) => {
    try {
        const client = await prisma.client.findUnique({
            where: { id: req.params.id },
        })
        res.json(client)
    } catch (error) {
        res.json({ error: error })

    }
}
exports.addClient = async (req, res, next) => {
    try {
        const client = await prisma.client.create({
            data: req.body
        })
        res.json(client)
    } catch (error) {
        next(error)
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
        res.json(client)
    } else {
        next(error)
    }
}

exports.editClient = async (req, res, next) => {

    try {
        const { id } = req.params
        const client = await prisma.client.update({
            where: { id: Number(id) },
            data: req.body,
        })
        res.json(client)
    } catch (error) {
        res.json({ error: error })
    }
}

exports.deleteClient = async (req, res, next) => {
    try {
        const { id } = req.params
        const client = await prisma.client.delete({
            where: { id: parseInt(id) },
        })
        res.json(client)
    } catch (error) {
        res.json({ error: error })
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
        res.json(data)
    } catch (error) {
        res.json({ error: error })
    }
}