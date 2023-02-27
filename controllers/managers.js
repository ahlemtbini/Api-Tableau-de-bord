const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getManagers = async(req, res, next)=>{
    const managers= [
        {
            nom: 'Jhon',
            prenom: 'Dupont',
            email: 'jhon@sosiete.fr',
            numTel: '+33 1 23 45 67 89',
            isActive: true,
            societes: [{nom: "nom société", id: 2},{nom: "nom société", id: 2},{nom: "nom société", id: 2}]
        },
        {
            nom: 'Jhon',
            prenom: 'Dupont',
            email: 'jhon@sosiete.fr',
            numTel: '+33 1 23 45 67 89',
            isActive: true,
            societes: [{nom: "nom société", id: 2},{nom: "nom société", id: 2},{nom: "nom société", id: 2}]
        },
        {
            nom: 'Jhon',
            prenom: 'Dupont',
            email: 'jhon@sosiete.fr',
            numTel: '+33 1 23 45 67 89',
            isActive: true,
            societes: [{nom: "nom société", id: 2},{nom: "nom société", id: 2},{nom: "nom société", id: 2}]
        },
        {
            nom: 'Jhon',
            prenom: 'Dupont',
            email: 'jhon@sosiete.fr',
            numTel: '+33 1 23 45 67 89',
            isActive: true,
            societes: [{nom: "nom société", id: 2},{nom: "nom société", id: 2},{nom: "nom société", id: 2}]
        },
        {
            nom: 'Jhon',
            prenom: 'Dupont',
            email: 'jhon@sosiete.fr',
            numTel: '+33 1 23 45 67 89',
            isActive: true,
            societes: [{nom: "nom société", id: 2},{nom: "nom société", id: 2},{nom: "nom société", id: 2}]
        },
     
    ]
    return res.status(200).json(managers)
}