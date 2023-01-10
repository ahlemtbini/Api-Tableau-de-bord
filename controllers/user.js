
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { decode } = require('jsonwebtoken')

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
        const role = await prisma.adminClient.create(
        {
          data: {
            user: {
              connect:{
                id:id
              }
            },
          }
        }
        )
        return role
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
        return res.status(404).json(result.error)
      }
      return res.status(200).json(result.role)
    })
    .catch(error=>next(error))
    // .catch((error)=>res.status(404).json({error}))
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
exports.deleteAll = async (req, res, next) => {
  try {
      const users = await prisma.user.deleteMany()
      return res.status(200).json({ users })
  } catch (error) {
      // res.status(404).json({ error: error })
      next(error)
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await prisma.user.delete({
      where: { id: id },
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
    console.log(req.body)
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    })
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
    .catch((error) => res.status(401).json({ error: "Mot de passe incorrect !" }));
  } catch (error) {
    // res.status(401).json({ error: 'email ou mot de passe non valide' })
    next(error)
  }
}


// exports.refreshUser = (req, res, next) => {
//   if (req.body.reToken) {
//     oldToken = req.body.reToken
//     const data = decode(oldToken, process.env.SECRET_KEY);
//     User.findOne({ _id: data.userId })
//       .then(user => {
//         if (!user) {
//           return res.status(401).json({ error: "couldnt refresh" });
//         }
//         res.status(200).json({
//           token: jwt.sign(
//             {
//               userId: user._id,
//               userRole: user.role,
//               nom: user.nom,
//               prenom: user.prenom,
//               tel: user.tel,
//               email: user.email,
//               expiresIn: 3600
//             },
//             process.env.SECRET_KEY,
//             { algorithm: "HS256" }
//           ),
//         });

//       })
//       .catch(error => res.status(401).json({ error: "couldnt refresh" }))
//   }
// }

// exports.forgotPassword = (req, res, next) => {
//   const { email } = req.body;
//   User.findOne({ email })
//     .then((user) => {
//       const token = jwt.sign(
//         { userId: user._id, email: user.email },
//         process.env.RESET_PASS_KEY,
//         {
//           expiresIn: "20m",
//         }
//       );
//       const link = process.env.CLIENT_URL + '/auth/reset-password/' + token;
//       user
//         .updateOne({ resetLink: token })
//         .then(() => {
//           const options = {
//             to: email,
//             from: '<contact@crops-advice.com>',
//             subject: "Mot de passe",
//             html: `<div style="background:#fff;
//             height:300px; display:flex;justify-content:center;align-items: center;">
//               <div style="background:#33373A;padding:30px;height:fit-content">
//                 <h2 style="background:#33373A;color:#61892F;margin:0;margin-bottom:30px;" >Réinitialisation de mot de passe :<br/></h2>
//                 <a style="background: #61892F;
//                 padding: 10px 20px;
//                 color: #000;
//                 text-decoration: none;
//                 border-radius: 25px;    width: 40%;
//                 margin: auto;
//                 display: block;text-align:center"
//                    href=${link}>cliquer ici</a>
//               </div>
//             </div>`,
//           };

//           const resEmail = send_mail(options, email)
//           // .catch(console.error)
//           //  console.log(resEmail, 'resEma');
//           return res.status(200).json({ message: "mail de restauration a été envoyé" })
//         })
//     })
//     .catch(error => {
//       res.status(401).json({ error: "user not found" })
//     })
// };

// exports.resetPassword = (req, res, next) => {
//   const { resetLink, newPass } = req.body;
//   if (resetLink) {
//     jwt.verify(resetLink, process.env.RESET_PASS_KEY, (err, decoded) => {
//       if (err) {
//         res.status(401).json({ error: "token incorrect or expired" })
//       }
//       User.findOne({ resetLink })
//         .then(user => {
//           bcrypt.hash(newPass, 10)
//             .then((hash) => {
//               user.updateOne(
//                 { password: hash }
//               )
//                 .then(() => res.status(200).json({ message: "password updated" }))
//             })
//             .catch((error) => res.status(500).json({ error: "server error" }));
//         })
//         .catch((error) => res.status(401).json({ error: "token incorrect or expired" }));
//     })
//   } else {
//     res.status(401).json({ error: "authentication error" });
//   }
// };