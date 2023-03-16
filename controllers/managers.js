const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const send_mail = require("../utility/sendEmail");

exports.getManagers = async (req, res, next) => {
    try {
        const managers = await prisma.manager.findMany({
          include: {
              user: true,
              societes: {
                select: {
                    societe:true
                }
              }
          }
        })
        res.status(200).json(managers)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}
exports.connectSocietes = async (req, res, next) => {
    try {
        const arr = []
        req.body.societes.map((el,id)=>{
            arr.push({
                societe: {
                    connect: {
                        id: Number(el)
                    }
                }
            })
        })
        const managers = await prisma.manager.update({
            where:{userId: req.body.id},
            data: {
                societes: {
                    create: arr
                }
            }
        })
        res.status(200).json(managers)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}

exports.createManager = (req, res, next) => {
    try {
      const unhasheMdp = "default"
      bcrypt.hash(unhasheMdp, 10)
      .then(async(hash)=>{
        const user = await prisma.user.create({
            data: {
              ...req.body.user,
              mdp: hash,
            }
        })
        console.log( req.body,user.id)
        const manager = await prisma.manager.create({
            data: {
                // clientId: Number(req.body.clientId),
                user: {
                    connect:{
                    id:user.id,
                    }
                },
                client: {
                    connect: {
                        id:Number(req.body.clientId)
                    }
                }
            }
        })
        console.log(manager)
        return res.status(200).json(user)
      })
      .catch(error=>res.status(404).json({error}))
    } catch (error) {
        next(error)
    //   res.status(404).json({error})
    }
  }

  exports.editManager = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: req.body.user,
        })
        res.status(200).json(user)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}

exports.deleteManager = async (req, res, next) => {
    try {
        const { id } = req.params
        const manager = await prisma.manager.delete({
            where: { id: parseInt(id) },
        })
        res.status(200).json(manager)
    } catch (error) {
        next(error)
        // res.status(404).json({ error: error })
    }
  }

// const forgotPassword = async(adminId) => {
//   try {
//       const user = await prisma.user.findUnique({
//         where:{
//           id: adminId
//         }
//       })
//       const token =  jwt.sign({
//           id: user.id,
//           email: user.email,
//           role: user.role,
//           expiresIn: 3600
//         },
//         process.env.ENCRYPT_KEY,
//         { algorithm: "HS256" }
//         )
//         const link = process.env.CLIENT_URL + '/auth/reset-password/' + token;
//         console.log(token,link,user.email)
  
//       const userUp = await updateUser(user.id,token)

//       const options = {
//         to: email,
//         from: '<contact@fleetrisk.fr>',
//         subject: "Mot de passe",
//         html: `<div style="background:#fff;
//         height:300px; display:flex;justify-content:center;align-items: center;">
//           <div style="background:#33373A;padding:30px;height:fit-content">
//             <h2 style="background:#33373A;color:#61892F;margin:0;margin-bottom:30px;" >Réinitialisation de mot de passe :<br/></h2>
//             <a style="background: #61892F;
//             padding: 10px 20px;
//             color: #000;
//             text-decoration: none;
//             border-radius: 25px;    width: 40%;
//             margin: auto;
//             display: block;text-align:center"
//                href=${link}>cliquer ici</a>
//           </div>
//         </div>`,
//       };

//       const resEmail = await send_mail(options, user.email)
//       console.log('resEmail',resEmail)
//       if(resEmail.info){
//         return  "mail de restauration a été envoyé"
//       }
//       return {error: resEmail}
//       // .catch(console.error)
//       //  console.log(resEmail, 'resEma');
//   } catch (error) {
//       res.status(401).json({ error})
//       // next(error)
//   }
// };

