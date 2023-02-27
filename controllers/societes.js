const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getSocietes = async (req,res,next)=>{
    try {      
        const societes= await prisma.societe.findMany({})
        return res.status(200).json([
            {
                nom        : 'nom societe',
                email      : 'societe@domain.com',
                numTel     : '+33 1 23 45 67 89',   
                region     : 'Grand Est',
                numSiret   : '12345671234567',
                creerPar   : 'super_admin',
                isActive   : true,
            },
            {
                nom        : 'nom societe',
                email      : 'societe@domain.com',
                numTel     : '+33 1 23 45 67 89',   
                region     : 'Grand Est',
                numSiret   : '12345671234567',
                creerPar   : 'super_admin',
                isActive   : true,
            },
            {
                nom        : 'nom societe',
                email      : 'societe@domain.com',
                numTel     : '+33 1 23 45 67 89',   
                region     : 'Grand Est',
                numSiret   : '12345671234567',
                creerPar   : 'super_admin',
                isActive   : true,
            },
            {
                nom        : 'nom societe',
                email      : 'societe@domain.com',
                numTel     : '+33 1 23 45 67 89',   
                region     : 'Grand Est',
                numSiret   : '12345671234567',
                creerPar   : 'super_admin',
                isActive   : true,
            },
            {
                nom        : 'nom societe',
                email      : 'societe@domain.com',
                numTel     : '+33 1 23 45 67 89',   
                region     : 'Grand Est',
                numSiret   : '12345671234567',
                creerPar   : 'super_admin',
                isActive   : true,
            },
            {
                nom        : 'nom societe',
                email      : 'societe@domain.com',
                numTel     : '+33 1 23 45 67 89',   
                region     : 'Grand Est',
                numSiret   : '12345671234567',
                creerPar   : 'super_admin',
                isActive   : true,
            },
            {
                nom        : 'nom societe',
                email      : 'societe@domain.com',
                numTel     : '+33 1 23 45 67 89',   
                region     : 'Grand Est',
                numSiret   : '12345671234567',
                creerPar   : 'super_admin',
                isActive   : true,
            },
        ])
    } catch (error) {
        return res.status(404).json({error})
    }
}