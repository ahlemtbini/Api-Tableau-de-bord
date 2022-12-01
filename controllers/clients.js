
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
exports.getClients = async (req, res, next) => {
    try {
        const clients= await prisma.client.findMany({})
        res.json(clients)
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