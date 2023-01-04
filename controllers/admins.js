const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getAdmins = async (req, res, next) => {
    try {
        const admins = await prisma.admin.findMany({})
        res.status(200).json(admins)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}
exports.add = async (req, res, next) => {
    try {
        const admin = await prisma.admin.create({
            data: req.body
        })
        res.status(200).json(admin)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}

exports.edit = async (req, res, next) => {
    try {
        const { id } = req.params
        const admin = await prisma.admin.update({
            where: { id: Number(id) },
            data: req.body,
        })
        res.status(200).json(admin)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}

exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params
        const admin = await prisma.admin.delete({
            where: { id: parseInt(id) },
        })
        res.status(200).json(admin)
    } catch (error) {
        res.status(404).json({ error: error })
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const { id } = req.params
        const admin = await prisma.admin.deleteMany({})
        return res.status(200).json({ message: "tous les admins ont été supprimés" })
    } catch (error) {
        res.status(404).json({ error: error })
    }
}