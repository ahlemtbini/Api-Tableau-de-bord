
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createRole = async (role, id) => {
  switch (role) {
    case "super_admin": {
      try {
        const role = await prisma.superAdmin.create({
          data: {
            userId: id
          }
        })
        return role
      } catch (error) {
        next(error)
      }
    }
    case "client_admin": {
      try {
        const role = await prisma.adminClient.create({
          data: {
            userId: id
          }
        })
        return role
      } catch (error) {
        next(error)
      }
    }
    case "manager": {
      try {
        const role = await prisma.manager.create({
          data: {
            userId: id
          }
        })
        return role
      } catch (error) {
        next(error)
      }
    }
    case "chauffeur": {
      try {
        const role = await prisma.chauffeur.create({
          data: {
            userId: id
          }
        })
        return role
      } catch (error) {
        next(error)
      }
    }
  }
}

exports.createUser = async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: {
        ...req.body,
      }
    })
    createRole(user.role, user.id)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

exports.getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        super_admin: true,
      },
    })
    res.json(users)
  } catch (error) {
    next(error)
  }
}
exports.getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        posts: true,
        profile: true
      }
    })
    res.json(user)
  } catch (error) {
    next(error)
  }
}
exports.editUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: req.body,
    })
    res.json(user)
  } catch (error) {
    next(error)
  }
}
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await prisma.user.delete({
      where: { id: Number(id) },
    })
    res.json(user)
  } catch (error) {
    next(error)
  }
}

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await prisma.profile.findMany({})
    res.json(profile)
  } catch (error) {
    next(error)
  }
}
exports.deleteProfile = async (req, res, next) => {
  try {
    const { id } = req.params
    const profile = await prisma.profile.delete({
      where: { id: Number(id) },
    })
    res.json(profile)
  } catch (error) {
    next(error)
  }
}