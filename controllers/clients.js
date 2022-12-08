
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
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
        res.json({ error: error })
        // next(error)
    }
}
exports.addLogo = async (req, res, next) => {
    console.log(req.body)
    try {
        const client = await prisma.client.create({
            data: {
                logo: Buffer.form([1, 2, 3])
            }
        })
        res.json(client)
    } catch (error) {
        res.json({ error: error })
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
        console.log(id)
        const client = await prisma.client.delete({
            where: { id: parseInt(id) },
        })
        res.json(client)
    } catch (error) {
        res.json({ error: error })
    }
}