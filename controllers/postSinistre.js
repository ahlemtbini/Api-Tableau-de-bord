const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getEPS = async (req, res, next) => {
    try {
        const eps = await prisma.entretienPostAccident.findMany({})
     return   res.status(200).json(eps)
    } catch (error) {
      return  next(error)
        // res.status(404).json({ error: error })
    }
}
exports.getUserEpsList = async (req, res, next) => {
    try {
        const user= await prisma.user.findUnique({
            where: {id: Number(req.body.id)},
            include: {
                manager: {
                    include: {
                        client: true,
                        societes: {
                            include: {
                                societe: {
                                    include: {
                                        sites: true
                                    }
                                }
                            }
                        }
                    }
                },
                admin_client: {
                    include: {
                        client: true
                    }
                },
                
            }
        })
      
        
        if(user.role == "client_admin"){
            const eps = await prisma.entretienPostAccident.findMany({
                where: {
                    clientId: user.admin_client.clientID
                }
            })
            return   res.status(200).json(eps)
        } else if(user.role == "manager"){
            const societesNames=[]
            user.manager.societes.map((soc)=>{
                societesNames.push(soc.societe.name)
            })
            console.log(req.body.id,user.role,societesNames)
            const eps = await prisma.entretienPostAccident.findMany({
                where: {
                    societe: {
                        in: societesNames,
                    }
                }
            })
            return   res.status(200).json(eps)
        } else {
            const eps = await prisma.entretienPostAccident.findMany({})
            return   res.status(200).json(eps)
        }
    } catch (error) {
        return  next(error)
        // res.status(404).json({ error: error })
    }
}

exports.addEPS = async (req, res, next) => {
  try {
      const eps = await prisma.entretienPostAccident.create({
          data: {
              ...req.body
          },
      })
      return res.json(eps)
  } catch (error) {
      // res.status(404).json({ error: error })
      next(error)
  }
}

exports.deleteEPS = async (req, res, next) => {
  try {
      const { id } = req.params
      const sinis = await prisma.entretienPostAccident.delete({
          where: { id: parseInt(id) },
      })
      return res.status(200).json(sinis)
  } catch (error) {
      res.status(404).json({ error: error })
  }
}
exports.upEPS = async (req, res, next) => {
  try {
      const { id } = req.params
      const eps = await prisma.entretienPostAccident.update({
          where: { id: parseInt(id) },
          data: req.body
      })
      return res.status(200).json(eps)
  } catch (error) {
      next(error)
      // res.status(404).json({ error: error })
  }
}