import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import {admins} from '../backup'

async function main() {
    await prisma.user.create({
        data:{
            
                "id": 8,
                "email": "olivier.domejean.agt@axa.fr",
                "nom": "Domejean",
                "prenom": "Olivier",
                "mdp": "$2b$10$CbNCTjpaETOEohjAG3HTvuluNF4IQdbX3f9yj56LF2Eu44JlelrZq",
                "role": "client_admin",
                "numTel": "+33685842456",
                "resetLink": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJvbGl2aWVyLmRvbWVqZWFuLmFndEBheGEuZnIiLCJyb2xlIjoiY2xpZW50X2FkbWluIiwiZXhwaXJlc0luIjozNjAwMCwiaWF0IjoxNjg3ODQ3Mjc3fQ.rN31pGEnK18ZJJtE98RncHJHjWh5deUGNMfCD96TaUs",
                "aciveInactive": true,
        }
    })

    await prisma.adminClient.createMany({
        data: admins
    })
}

main()
.catch((e)=>{
    console.log(e);
    // process.exit(1);
})
.finally(async () =>{
    await prisma.$disconnect();
})