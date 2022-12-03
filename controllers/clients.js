
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
exports.getClients = async (req, res, next) => {
    try {
        const clients = await prisma.client.findMany({})
        res.json(clients)
    } catch (error) {
        next(error)
    }
}
exports.getClient = async (req, res, next) => {
    try {
        const client = await prisma.client.findUnique({
            where: { id: req.params.id },
        })
        res.json(client)
    } catch (error) {
        next(error)
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

exports.editClient = async (req, res, next) => {
    try {
        const { id } = req.params
        const client = await prisma.client.update({
            where: { id: Number(id) },
            data: req.body,
        })
        res.json(client)
    } catch (error) {
        next(error)
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
        next(error)
    }
}