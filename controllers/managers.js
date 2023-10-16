const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const send_mail = require("../utility/sendEmail");

exports.getManagerSinistres = async (req, res, next) => {
    try {
      const { id } = req.params
      const manager = await prisma.manager.findUnique({
        where: {userId: Number(id)},
        include: { 
            societes: { 
                select: { societe: true}
             },
        }
      })
      const socNames = []
      manager.societes.map(soc=>{
        socNames.push(soc.societe.name)
      })
      const sinis = await prisma.declarationSinistre.findMany({
        where: {
            SOCIETE: {
            in: socNames,
          },
        },
      });

        res.status(200).json(sinis)
    } catch (error) {
        next(error)
    }
}

exports.getManagers = async (req, res, next) => {
    try {
        const managers = await prisma.manager.findMany({
          include: {
              user: true,
              societes: {
                select: {
                    societe:true,
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

exports.getManager = async (req, res, next) => {
    try {
        const managers = await prisma.manager.findMany({
            where: {
                userId: parseInt(req.params.id)
            },
          include: {
            client: {
                include: {
                    countrys:{
                        include: {
                            regions: true
                        }
                    },
                    contrats: true
                }
            },
              user: true,
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
        })
        res.status(200).json(managers)
    } catch (error) {
        // res.status(404).json({ error: error })
        next(error)
    }
}

exports.getUserManagers = async (req, res, next) => {
    try {
        const user= await prisma.user.findUnique({
            where: {id: Number(req.params.id)},
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
                admin_client: true
            }
        })
        let idClient = null
        if(user.admin_client){
            idClient= user.admin_client.clientID
        } else if(user.manager){
            idClient= user.manager.clientId
        }
        let managers = []
        if(idClient !== null){
            managers = await prisma.manager.findMany({
                where: {
                    clientId: idClient
                },
                include: {
                    user: true,
                    societes: {
                      select: {
                          societe:true,
                      }
                    }
                }
              }) 
        } else {
            managers = await prisma.manager.findMany({
                include: {
                    user: true,
                    societes: {
                      select: {
                          societe:true,
                      }
                    }
                }
             })
        }
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
        const { id } = req.params;

        // Update the user information
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: req.body.user,
            include: {
                manager: {
                    include: {
                        societes: true
                    }
                }
            }
        });

        const oldSocietes= updatedUser.manager.societes

        // Calculate which Societes to disconnect
        const societesToDisconnect = oldSocietes.filter((existingSociete) =>
        !req.body.societes.some((updatedSociete) => updatedSociete.id === existingSociete.id)
        );
        const arr = []
        req.body.societes.map((el,id)=>{
            arr.push({
                societe: {
                    connect: {
                        id: el.id
                    }
                }
            })
        })
        // Connect the updated Client
        if(updatedUser.manager.clientId !== Number(req.body.clientId) ){
            
            const updateClient = await prisma.manager.update({
                where: { id: updatedUser.manager.id },
                data: {
                    client: {
                        connect: {
                            id: Number(req.body.clientId),
                        },
                    },
                },
            });
        }
        const updatedManager = await prisma.manager.update({
            where: { id: updatedUser.manager.id },
            data: {
                client: {
                    connect: {
                        id: Number(req.body.clientId),
                    },
                },
                societes: {
                    create: arr
                    // connect: req.body.societes.map((el) => ({
                    //     id: el.id,
                    // })),
                },
            },
        });
        // Disconnect the outdated Societes
        if(societesToDisconnect.length > 0){
            console.log('societesToDisconnect',societesToDisconnect,'soc',req.body.societes)
            await prisma.manager.update({
                where: { id: updatedUser.manager.id },
                data: {
                    societes: {
                        disconnect: societesToDisconnect.map((societe) => ({
                            id: societe.id,
                        })),
                    },
                },
            });
        }
        res.status(200).json({ updatedUser, updatedManager });
    } catch (error) {
        next(error);
    }
};


exports.deleteManager = async (req, res, next) => {
    try {
        const { id } = req.params
        const manager = await prisma.manager.delete({
            where: { id: parseInt(id) },
        })
        const user = await prisma.user.delete({
            where: { id: manager.userId },
        })
        res.status(200).json(user)
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

