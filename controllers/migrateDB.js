const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const {sinistresData,usersData,adminsData} = require('../backup')

// sinistres
  exports.getSinistres = async (req, res, next) => {
    try {
        const sinistres = await prisma.sinistre.findMany({
            include: {
                declarationSinistre: true
            }
        })
        res.json(sinistres)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}
function removeNullValues(obj) {
    const entries = Object.entries(obj);
    const filteredEntries = entries.filter(([key, value]) => value !== null);
    const filteredObj = Object.fromEntries(filteredEntries);
    return filteredObj;
  }
exports.addSinistres = (req, res, next) => {
    try {
        sinistresData.map(async(sin,id)=>{

            const decSin = sin.declarationSinistre
            delete decSin.DOSSIER
            delete sin.declarationSinistre
            const sinData= removeNullValues(sin)
            const decSinData = removeNullValues(decSin)
           
            // console.log('test',sinData,decSinData)
            const sinis = await prisma.sinistre.create({
                data: {
                    ...sinData,
                    declarationSinistre: {
                        create: {
                            ...decSinData
                        }
                    }
                },
            })
        })
        return res.json("sinis added")
    } catch (error) {
        next(error)
    }
}
// users
exports.createUsers = async (req, res, next) => {
    try {
        usersData.map(async(el)=>{
          const userData=removeNullValues(el)
          const user = await prisma.user.create({
              data: {
                ...userData,
              }
          })
      })
        return res.status(200).json("users added")
    } catch (error) {
      next(error)
    }
  }
//Admins
exports.getAdmins = async (req, res, next) => {
    try {
        const admins = await prisma.admin.findMany({
        })
        res.json(admins)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}
exports.createAdmins = async (req, res, next) => {
    try {
        const formattedAdmins= []
        adminsData.map((el)=>{
            const data={id:el.id, userId:el.userId,clientID:el.clientID}
            formattedAdmins.push(data)
        })
        console.log(formattedAdmins)
        // formattedAdmins.map(async(adminData)=>{
        //     const admin =await prisma.adminClient.create({
        //       data: {
        //         // id: adminData.id,
        //         user: {
        //             connect:{
        //                 id: adminData.userId
        //             }
        //         },
        //         adminClient: {
        //             connect:{
        //                 id: adminData.clientID
        //             }
        //         }
        //       }
        //     })
        // })
    } catch (error) {
      return res.status(400).json("ce email existe déja!")
      // next(error)
    }
  }
exports.createMannagers = async (req, res, next) => {
    try {
        const manager = await prisma.manager.create({
              data: {
                  id: id,
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
    } catch (error) {
      next(error)
    }
  }
