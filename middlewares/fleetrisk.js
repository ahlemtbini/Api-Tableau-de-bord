const express = require("express");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const { decode } = require('jsonwebtoken')
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authType= req.headers.authorization.split(" ")[0];
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = decode(token, process.env.FLEET_ENCRYPT)
    if(authType.toLowerCase() == 'basic'){
      console.log('basic',authType,'token','decoded',decodedToken)
      // bcrypt.compare(decodedToken.mdp, user.mdp)
      // .then((valid)=>{
      //   if (!valid) {
      //     return res.status(401).json({ error: "Utilisateur non autorisé !" });
      //   }
      // })
      // .catch((err)=> res.status(401).json({ error: "Utilisateur non autorisé !" }))

    } else {
      console.log('bearer',authType,'token',decodedToken)
      if (decodedToken.email == 'api.admin@fleetrisk.fr' && decodedToken.role == 'admin_api_fleetrisk') {
          const user = await prisma.apiAdmin.findUnique({
              where: {id: decodedToken.id}
          })
          if(user){
            console.log('user',user)
            req.user= {user}
            next();
          } else {
             return res.status(401).json({ error: "Utilisateur non autorisé !" })
          }
      } else {
        return res.status(401).json({ error: "Utilisateur non autorisé !" })
      }
    }
  } catch (error) {
    res.status(401).json( "Utilisateur non autorisé !" );
  }
};

