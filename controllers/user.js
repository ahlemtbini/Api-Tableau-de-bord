
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
       return role
      } catch (error) {
        return res.status(400).json({error})
        // next(error)
      }      
    }
    case "manager": {
      try {
        const role = await prisma.manager.create({
          data: {
            ...roleData,
            user: {
              connect:{
                id:id
              }
            },
          }
        })
       return role
      } catch (error) {
        return res.status(400).json({error})
        // next(error)
      } 
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
      next(error)
      // return res.status(400).json("ce email existe déja!")
    })
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
        expiresIn: 36000
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
              expiresIn: 36000
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
    console.log(user)
    // return true
  } catch (error) {
    console.log(error)
  }
 }

exports.forgotPassword = async(req, res, next) => {
  const  email= req.body.email;
  console.log('test mail',email)
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
          expiresIn: 36000
        },
        process.env.ENCRYPT_KEY,
        { algorithm: "HS256" }
        )
        console.log('test t',token)
      const link = process.env.CLIENT_URL + '/auth/reset-password/' + token;
  
      updateUser(user.id,token)

      const options = {
        to: email,
        from: '<contact@fleetrisk.fr>',
        subject: "Réinitialisation de mot de passe",
        html: `<div>
        <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif"><b>
            <img src="https://fleetrisk.fr/_next/image?url=%2Flogo_white.png&w=1920&q=75" width="200px" max-width="200px" />
        </b></p>
        <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif"><b>&nbsp;</b></p>
        <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif"><b>Bonjour </b> ${user.prenom}</p>
        <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">&nbsp;</p>
        <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">Nous vous remercions
        de votre inscription à votre espace FLEETRISK et vous confirmons que votre
        compte est désormais actif.</p>
        <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">&nbsp;</p>
        <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">Pour commencer à
        utiliser FLEETRISK, veuillez noter votre Identifiant suivant&nbsp;: ${user.email}
        puis cliquer sur le lien ci-dessous.</p>
        <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">&nbsp;</p>
        <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif;margin: 20px 0px;"><b>
         <a href=${link}><span style="color:white;background:navy;padding:12px">Je me connecte</span></a></b></p>
        
        <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif;margin-top:35px;"><b>Nous contacter . 
            <a href="mailto:contact@fleetrisk.fr" style="color:rgb(5,99,193)" target="_blank">contact@fleetrisk.fr</a> .</b> <b>
            <a href="https://fleetrisk.fr" style="color:rgb(5,99,193)" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://fleetrisk.fr&amp;source=gmail&amp;ust=1680863108559000&amp;usg=AOvVaw0ZYineXysI0H-2PyZQjk4X">https://fleetrisk.fr</a> . Politique de
        confidentialité</b></p>
        </div> `,
      };


      console.log(options)
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

exports.confirmationMail = async(req, res, next) => {
  const  email= req.body.email;
  console.log('test mail',email)
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
          expiresIn: 36000
        },
        process.env.ENCRYPT_KEY,
        { algorithm: "HS256" }
        )
        console.log('test t',token)
      const link = process.env.CLIENT_URL + '/auth/reset-password/' + token;
  
      updateUser(user.id,token)

      const options = {
        to: email,
        from: '<contact@fleetrisk.fr>',
        subject: "Votre compte FLEETRISK est actif !",
        html: `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <title>Titre</title>
            </head>
        
            <body>
                <div>
                    <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif"><b>
                        <img src="https://fleetrisk.fr/_next/image?url=%2Flogo_white.png&w=1920&q=75" width="200px" max-width="200px"/>
                    </b></p>
                    <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif"><b>&nbsp;</b></p>
                    <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif"><b>Bonjour</b>${user.prenom}</p>
                    <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">&nbsp;</p>
                    <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">Nous vous remercions
                    de votre inscription à votre espace FLEETRISK et vous confirmons que votre
                    compte est désormais actif.</p>
                    <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">&nbsp;</p>
                    <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">Pour commencer à
                    utiliser FLEETRISK, veuillez noter votre Identifiant suivant&nbsp;: ${user.email}
                    puis cliquer sur le lien ci-dessous.</p>
                    <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif">&nbsp;</p>
                    <div align="center">
                        
                        <button style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif;margin: 20px 0px;color:white;background:#0b1e3e;padding:12px">
                            <a href="${link}"><span style="color:white">Je me connecte</span></a>
                        </button>
                    </div>
                    <p align="center" style="text-align:center;margin:0cm;font-size:11pt;font-family:Calibri,sans-serif;margin-top:35px;"><b>Nous contacter . 
                        <a href="mailto:contact@fleetrisk.fr" style="color:rgb(5,99,193)" target="_blank">contact@fleetrisk.fr</a> .</b> <b>
                        <a href="https://fleetrisk.fr" style="color:rgb(5,99,193)" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://fleetrisk.fr&amp;source=gmail&amp;ust=1680863108559000&amp;usg=AOvVaw0ZYineXysI0H-2PyZQjk4X">https://fleetrisk.fr</a> . Politique de
                    confidentialité</b></p>
                </div>  
            </body>
        </html>`,
      };


      console.log(options)
      const resEmail = await send_mail(options, email)
      console.log(resEmail)
      if(resEmail.rejected.length > 0){
        return res.error({error: "mail de restauration n'a pas pu être envoyé"} )
      }
      return res.status(200).json({ message: "mail de restauration a été envoyé" })
  } catch (error) {
      res.status(404).json({ error: "adresse mail n'est pas trouvé" })
  }
};