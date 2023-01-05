
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');

const createRole = async (role, id, roleData) => {
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
            userId: id,
            ...roleData
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
    console.log(req.body)
    const user = await prisma.user.create({
      data: {
        ...req.body.user,
      }
    })
    createRole(user.role, user.id, req.body.roleData)
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

exports.addPhoto = async (req, res, next) => {
  let photo = ""
  if (req.files) {
      const fName = req.files[0].filename;
      photo = (`${req.protocol}://${req.get('host')}/api/documents/${fName}`)
      const profile = await prisma.profile.update({
          where: { userId: Number(req.params.id) },
          data: {
              photo: photo
          }
      })
      res.status(200).json(profile)
  } else {
      res.status(404).json({ error: error })
  }
}
//auth
exports.login = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    })
    if (!user) {
      return res.status(404).json({ error: "Il n’existe pas un compte avec ce mail !" });
    }
    bcrypt.compare(req.body.password, user.mdp)
    .then((valid)=>{
      if (!valid) {
        return res.status(401).json({ error: "Mot de passe incorrect !" });
      }
      res.status(200).json({
        token: jwt.sign({
          userId: user.id,
          email: user.email,
          tel: user.tel,
          role: user.role,
          expiresIn: 3600
        },
        process.env.ENCRYPT_KEY,
        { algorithm: "HS256" }
        )}
      )
    })
    .catch((error) => res.status(401).json({ error: "Mot de passe incorrect !" }));
  } catch (error) {
    res.status(401).json({ error: 'email ou mot de passe non valide' })
    next(error)
  }
}