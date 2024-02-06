const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { decode } = require('jsonwebtoken')

exports.getAdmins = async (req, res, next) => {
    try {
        const admins = await prisma.apiAdmin.findMany({})

        res.status(200).json(admins)
    } catch (error) {
        res.status(404).json({ error: error })
        // next(error)
    }
}

exports.register = (req, res, next) => {
  try {
    const unhasheMdp = req.body.user.mdp 
    bcrypt.hash(unhasheMdp, 10)
    .then(async(hash)=>{
      const user = await prisma.apiAdmin.create({
          data: {
            ...req.body.user,
            mdp: hash
          }
      })
      return res.status(200).json(user)
    })
    .catch(error=>{
      next(error)
    })
  } catch (error) {
    return res.status(400).json("ce email existe déja!")
  }
}

exports.login = async (req, res, next) => {
  try {
    const user = await prisma.apiAdmin.update({
      where: { email: req.body.email },
      data:{
        aciveInactive: true
      }
    })
    console.log('user',user)
    if (!user ) {
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
        expiresIn: 3600000
      },
      process.env.ENCRYPT_KEY,
      { algorithm: "HS256" }
      )})
    })
    .catch((error) => res.status(404).json({ error: "Mot de passe incorrect !" }));
  } catch (error) {
    return res.status(404).json({ error: 'email ou mot de passe non valide' })
  }
}

const getGraph1 = (sinis)=>{
  return sinis?.length
}
const getDateObject = (date)=>{
  if(date){
      const year=date?.split('-')[2]
      const month= date?.split('-')[1]- 1
      const day =date?.split('-')[0]
      return new Date(year,month,day)
  }
}
const getGraph2 = (sinis)=>{
  const aujourdhui =  new Date();  // Get the current date
  const debutAnnee =  new Date(aujourdhui.getFullYear(), 0, 1); 
  const difference =  aujourdhui - debutAnnee

  const upSin =sinis?.filter((sin)=> {
    const date= sin.DATE_SURVENANCE && dateToNumber(sin.DATE_SURVENANCE)
    const startDate= "01-01-2023"
    const aujourdhui = new Date();
    
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const dateFormatee = aujourdhui.toLocaleDateString('fr-FR', options).replace(/\//g, '-');
    const endDate=  dateToNumber(dateFormatee)
    if((date > startDate) && (date < endDate) ){
        return true
    } else {
        return false
    }
})

  // Convert the difference to days
  const daysFromStartOfYear = Math.floor(difference / (1000 * 60 * 60 * 24));
  const res=(Math.round(upSin.length/daysFromStartOfYear))
  return res
}

exports.getGraphs = async (req, res, next) => {
  try {
      let obj= {NUMERO_CLIENT: '1'}
      if(req.body.annee){
        obj= {...obj, ANNEE: req.body.annee }
      }
      if(req.body.region){
        obj= {...obj, REGION: req.body.region }
      }
      if(req.body.societe){
        obj= {...obj, SOCIETE: req.body.societe }
      }
      if(req.body.site){
        obj= {...obj, SITE: req.body.site }
      }

      const sinis = await prisma.declarationSinistre.findMany({
        where: {
          ...obj
        }
      })
      let dashbord = {
        graph1: getGraph1(sinis),
        graph2: getGraph2(sinis),
      }

      res.status(200).json(dashbord)
  } catch (error) {
      res.status(404).json({ error: next(error) })
  }
}
