const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.getAdmins = async (req, res, next) => {
    try {
        const admins = await prisma.adminClient.findMany({
          include: {
            client:true
          },
          include: {
            user:true,
          }
        })
        const arr= []
        admins.map(admin=>{
          arr.push({...admin.user,userId:admin.userId, clientID:admin.clientID,id:admin.id})
        })
        res.status(200).json(arr)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}
exports.getAdminClients = async (req, res, next) => {
    try {
      const { id } = req.params
      console.dir(id)
        const admin = await prisma.adminClient.findUnique({
          where:{
            userId: parseInt(id)
          },include: {
            user:true
          }, include:{
            client:true
          }
        })
        res.status(200).json(admin)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}
exports.getAdminSinistres = async (req, res, next) => {
    try {
      const { id } = req.params
      const sinis = await prisma.sinistre.findMany({
        where:{
            creatorId : id
          },
          select : {
            declarationSinistre: true
          }
        })
        const arr=[]
        sinis.map(el=>{
          arr.push(el.declarationSinistre)
        })
        console.dir(arr)
        res.status(200).json(arr)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}
exports.getSaClients = async (req, res, next) => {
    try {
      const { id } = req.params
        const admin = await prisma.superAdmin.findUnique({
          where:{
            id: parseInt(id)
          },select: {
            clients:true
          }
        })
        res.status(200).json(admin)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}
exports.createAdmin = (req, res, next) => {
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
        const admin =await prisma.adminClient.create({
          data: {
            userId: user.id,
          }
        })
        return res.status(200).json(admin)
      })
      .catch(error=>res.status(404).json({error}))
      // .catch((error)=>res.status(404).json({error}))
    } catch (error) {
      res.status(404).json({error})
    }
  }

  exports.editAdmin = async (req, res, next) => {
    // console.dir(req.body)
    try {
        const { id } = req.params
        const admin = await prisma.adminClient.update({
            where: { id: Number(id) },
            data: {
              clientID: Number(req.body.clientID),
            }
        })
        delete req.body.clientID
        try {
        const user = await prisma.user.update({
          where: { id: admin.userId},
          data: req.body
        })
        } catch (error) {
          // res.status(404).json({ error: "email exise déja" })
          next(error)
        }
        res.status(200).json("client a été modifié avec succès")
    } catch (error) {
        // res.status(404).json({ error: "email exise déja" })
        next(error)
    }
}

exports.deleteAdmin = async (req, res, next) => {
  try {
      const { id } = req.params
      const admin = await prisma.adminClient.delete({
          where: { id: parseInt(id) },
      })
      res.status(200).json(admin)
  } catch (error) {
      res.status(404).json({ error: error })
  }
}
  
exports.addClient = async (req, res, next) => {
    try {
        const adminClient = await prisma.adminClient.update({
            where: { userId: req.body.id },
            data: {
                clientID: req.body.clientID
            }
        })
        res.status(200).json(adminClient)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}

const forgotPassword = async(email, res) => {
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
      // .catch(console.error)
      //  console.log(resEmail, 'resEma');
      return res.status(200).json({ message: "mail de restauration a été envoyé" })
  } catch (error) {
      res.status(401).json({ error: "user not found" })
  }
};
