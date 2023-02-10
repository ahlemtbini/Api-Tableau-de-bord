
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { decode } = require('jsonwebtoken')
const send_mail = require("../utility/sendEmail");
require("dotenv").config();


const createRole = async (role, id, roleData) => {
  const obj = {
    userId: id
  }

  switch (role) {
    case "super_admin": {
        const role = await prisma.superAdmin.create({data: obj})
        return role
    }
    case "client_admin": {
      try {
        const role = await prisma.adminClient.create({
          data: {
            user: {
              connect:{
                id:id
              }
            },
          }
        })
        // console.log('role',role)
       return role
      } catch (error) {
        return res.status(400).json({error})
        // next(error)
      }      
    }
    case "manager": {
        const role = await prisma.manager.create({data: obj})
        return role
    }
    case "chauffeur": {
        const role = await prisma.chauffeur.create({data: obj})
        return role
    }
  }
}

exports.createUser = (req, res, next) => {
  try {
    const unhasheMdp = req.body.user.mdp ? req.body.user.mdp :"default"
    bcrypt.hash(unhasheMdp, 10)
    .then(async(hash)=>{
      const user = await prisma.user.create({
          data: {
            ...req.body.user,
            mdp: hash
          }
      })
      const result =await createRole(user.role, user.id, req.body.roleData)
      console.log(result)
      if(result.error){
        return res.status(404).json({error: result.error})
      }
      return res.status(200).json(user)
    })
    .catch(error=>{
      return res.status(400).json("ce email existe déja!")
    })
    // .catch((error)=>res.status(404).json({error}))
  } catch (error) {
    return res.status(400).json("ce email existe déja!")
    // next(error)
  }
}

exports.getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        super_admin: true,
      },
      include: {
        profile: true,
      }
    })
    res.json(users)
  } catch (error) {
    // next(error)
    return res.status(400).json({error})

  }
}
exports.getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        profile: true
      }
    })
    res.json(user)
  } catch (error) {
    return res.status(400).json({error})
    // next(error)
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
    return res.status(400).json({error})
    next(error)
  }
}
exports.deleteAll = async (req, res, next) => {
  try {
      const users = await prisma.user.deleteMany()
      return res.status(200).json({ users })
  } catch (error) {
      res.status(404).json({ error: error })
      next(error)
  }
}

exports.deleteUser = async (req, res, next) => {
  // console.log(req.params)
  try {
    const { id } = req.params
    const user = await prisma.user.delete({
      where: { id: Number(id) },
    })
    return res.json(user)
  } catch (error) {
    // return res.status(404).json({ error: error })
    next(error)
  }
}


exports.getProfile = async (req, res, next) => {
  try {
    const profile = await prisma.profile.findMany({})
    return res.json(profile)
  } catch (error) {
    return res.status(404).json({ error: error })
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
    return res.status(404).json({ error: error })
    // next(error)
  }
}

exports.addPhoto = async (req, res, next) => {
  console.log(req.params,req.files)
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
     return res.status(200).json(profile)
  } else {
    next(error)
    //  return res.status(404).json({ error: error })
  }
}
//auth

exports.login = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    })
    console.dir(req.body)
    if (!user) {
      return res.status(404).json({ error: "Il n’existe pas un compte avec ce mail !" });
    }
    bcrypt.compare(req.body.mdp, user.mdp)
    .then((valid)=>{
      if (!valid) {
        return res.status(401).json({ error: "Mot de passe incorrect !" });
      }
      
      return res.status(200).json({token: jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
        expiresIn: 3600
      },
      process.env.ENCRYPT_KEY,
      { algorithm: "HS256" }
      )})
    })
    .catch((error) => res.status(404).json({ error: "Mot de passe incorrect !" }));
  } catch (error) {
    return res.status(404).json({ error: 'email ou mot de passe non valide' })
    // next(error)
  }
}

 exports.refreshUser = (req, res, next) => {
   if (req.body.reToken) {
     oldToken = req.body.reToken
     const data = decode(oldToken, process.env.SECRET_KEY);
     User.findOne({ _id: data.userId })
       .then(user => {
         if (!user) {
           return res.status(401).json({ error: "couldnt refresh" });
         }
         res.status(200).json({
           token: jwt.sign(
            {token: jwt.sign({
              id: user.id,
              email: user.email,
              role: user.role,
              expiresIn: 3600
            },
            process.env.ENCRYPT_KEY,
            { algorithm: "HS256" }
            )}
           ),
         });

       })
       .catch(error => res.status(401).json({ error: "couldnt refresh" }))
   }
 }

 const updateUser = async(id,token)=>{
  try {
    const user = await prisma.user.update({
      where: { id: id },
      data:{
        resetLink: token,
      }
    })
    console.log(true)
    // return true
  } catch (error) {
    console.log(error)
  }
 }

exports.forgotPassword = async(req, res, next) => {
  const { email } = req.body;
  try {
      const user = await prisma.user.findUnique({
        where:{
          email: email
        }
      })
      const token =  jwt.sign({
          id: user.id,
          email: user.email,
          role: user.role,
          expiresIn: 3600
        },
        process.env.ENCRYPT_KEY,
        { algorithm: "HS256" }
        )
        console.log(token)
      const link = process.env.CLIENT_URL + '/auth/reset-password/' + token;
  
      updateUser(user.id,token)

      const options = {
        to: email,
        from: '<contact@fleetrisk.fr>',
        subject: "Mot de passe",
        html: `<div style="background:#fff;
        height:300px; display:flex;justify-content:center;align-items: center;">
          <div style="background:#33373A;padding:30px;height:fit-content">
            <h2 style="background:#33373A;color:#61892F;margin:0;margin-bottom:30px;" >Réinitialisation de mot de passe :<br/></h2>
            <a style="background: #61892F;
            padding: 10px 20px;
            color: #000;
            text-decoration: none;
            border-radius: 25px;    width: 40%;
            margin: auto;
            display: block;text-align:center"
               href=${link}>cliquer ici</a>
          </div>
        </div>`,
      };

      const resEmail = await send_mail(options, email)
      console.log(resEmail)
      if(resEmail.rejected.length > 0){
        return res.error("mail de restauration n'a pas pu être envoyé" )
      }
      return res.status(200).json({ message: "mail de restauration a été envoyé" })
  } catch (error) {
      res.status(404).json({ error: "adresse mail n'est pas trouvé" })
      // next(error)
      // res.status(401).json({ error: "user not found" })
  }
};



exports.resetPassword = (req, res, next) => {
  console.log(req.body)
  const { resetLink, newPass } = req.body;
  if (resetLink) {
    jwt.verify(resetLink, process.env.ENCRYPT_KEY,  (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "token incorrect or expired" })
      }
      console.log('decoded',decoded)
      bcrypt.hash(newPass, 10)
      .then(async(hash) => {
        try {
          const user = await prisma.user.update({
            where: { id: decoded.id },
            data:{
              mdp: hash,
            }
          })
          console.log(true)
          return res.status(200).json("mot de passe modifié")
        } catch (error) {
          next(error)
        }
      })
      .catch((error) => res.status(500).json({ error: "server error" }));

    })
  } else {
    res.status(401).json({ error: "not allowed" });
  }
}