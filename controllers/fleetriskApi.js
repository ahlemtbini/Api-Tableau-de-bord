const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { decode } = require('jsonwebtoken');
const fleetrisk = require('../middlewares/fleetrisk');

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
exports.deleteAdmins =async (req, res, next) => {
  try {
   const admins= await prisma.apiAdmin.deleteMany({})
   return res.status(200).json("api admins deleted")
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
      process.env.FLEET_ENCRYPT,
      { algorithm: "HS256" }
      )})
    })
    .catch((error) => res.status(404).json({ error: "Mot de passe incorrect !" }));
  } catch (error) {
    return res.status(404).json({ error: 'email ou mot de passe non valide' })
  }
}

const removeDoubles = (sinis)=>{
    const upSin = [];
    const nameSet = new Set();
    let x=[]
    sinis.forEach(obj => {
    if(obj.REF_SINISTRE_ASUREUR){
        if (!nameSet.has(obj.REF_SINISTRE_ASUREUR)) {
            nameSet.add(obj.REF_SINISTRE_ASUREUR);
            upSin.push(obj);
        }else {
            x.push(obj.REF_SINISTRE_ASUREUR)
        }
    } else {
        if (!nameSet.has(obj.DOSSIER)) {
          nameSet.add(obj.DOSSIER);
          upSin.push(obj);
        } else {
          x.push(obj.obj.DOSSIER)
        }
    }
    });
    // console.log(x)
  return upSin
}
const dateToNumber=(a)=>{
  return  Number((a.split('-')[2]) + ((a.split('-')[1])) + (a.split('-')[0]))
}
const roundNumber = (x,n)=>{
  const y= Math.pow(10,n)
  return Math.round(x*y)/y
}
const getGraph2 = (sinis,annee)=>{
  let aujourdhui =  new Date();  // Get the current date
  let currentYear = new Date().getFullYear()
  if(parseInt(annee) !== new Date().getFullYear() ){
    aujourdhui =  new Date(annee+"-12-31"); 
    currentYear= parseInt(annee)
  }
  console.log('current yrear',currentYear)
  // const currentYear =2023
  const debutAnnee =  new Date(currentYear+'-01-01'); 
  const difference =  aujourdhui - debutAnnee
  const upSin =sinis?.filter((sin)=> {
    const date= sin.DATE_SURVENANCE && dateToNumber(sin.DATE_SURVENANCE)
    const aujourdhui = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const dateFormatee = aujourdhui.toLocaleDateString('fr-FR', options).replace(/\//g, '-');
    const startDate= dateToNumber("01-01-"+currentYear)
    const endDate=  dateToNumber(dateFormatee)
    if((date >= startDate) && (date <= endDate) ){
        return true
    } else {
        return false
    }
  })
  // Convert the difference to days
  const daysFromStartOfYear = Math.floor(difference / (1000 * 60 * 60 * 24));
  console.log(difference,daysFromStartOfYear,upSin.length)
  const res=roundNumber((upSin.length/daysFromStartOfYear),2)
  return {res:res,"nbre de sinistres":upSin.length, "nbre de jours depuis debut d'année":daysFromStartOfYear }
}

const separateurMilier = (x)=>{
  if(x){
    const numberString = x?.toString();
    return numberString.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  } 
}

const getGraph3 = (objectif)=>{
  return separateurMilier(objectif) + " €"
}

const getMonthFr= (date) =>{
  const month = date.split('-')[1]
  return month;
}

const getCurrentMonth= () =>{
  const currentDate = new Date();
  const month = (currentDate.getMonth() + 1)?.toString().padStart(2, '0');
  return month;
}

const getGraph4 = (sinis)=>{
  let somme=0.0
  let monthSomme = 0.0
  let errorValues=[]
  sinis.map((sin)=>{
      if((parseFloat(sin.CHARGE_REELLE))){
          somme= somme+parseFloat(sin.CHARGE_REELLE)
          if(getMonthFr(sin.DATE_SURVENANCE) == getCurrentMonth() ){
              monthSomme = monthSomme + parseFloat(sin.CHARGE_REELLE)
          }
      } else {
          if((sin.CHARGE_REELLE!= 0) && (sin.CHARGE_REELLE !== '') && (sin.CHARGE_REELLE !== null)){
              errorValues.push(sin.CHARGE_REELLE)
          }
      }
  })
  if(errorValues.length>0){
      console.log(errorValues,'tablaux des fausses valeurs charge réelle ')
  }
  return Math.round(somme) 
}
const getGraph5 = (charge,objectif)=>{
  const percentageUsed = Math.round((charge / objectif) * 100);
  return percentageUsed
}

const getYear = (date)=>{
  const year=date.split('-')[2]
  return year
}
const getMonth = (date)=>{
  const month=date.split('-')[1]
  return month
}
const getDayName = (dateStr)=>{
  const [day, month, year] = dateStr.split("-");
  // Create a new Date object using the given date components
  const date = new Date(year, parseInt(month) - 1, day);
  // Get the French name of the day
  const options = { weekday: 'long', timeZone: 'UTC' };
  const frenchDayName = date.toLocaleDateString('fr-FR', options);
  return frenchDayName
}
const PrepareDayData = (sinis)=>{
  const upSin = []
  const week=["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"]
  for(let key in week){
    const upJour =upSin[key] ? [...upSin[key]] : []
    sinis.map((sin)=>{
      const date= sin.DATE_SURVENANCE 
      // console.log(getDayName(date) ,week[key])
        if(getDayName(date) == week[key]){
          upJour.push(sin)
          upSin[key] = upJour
        }
    })
  }
  // console.log(upSin)
  let sinsPerDay ={}
  upSin.map((el,id)=>{
    const key= week[id]
    sinsPerDay = {...sinsPerDay, [key]: el.length }
  })
  return sinsPerDay
}
const PrepareMonthData = (sinis,year)=>{
  const upSin = []
  for (let i = 1; i < 13; i++) {
    upSin[i]=[]
  }
  const currentYear = year
  sinis.map((sin)=>{
    const date= sin.DATE_SURVENANCE 
    if(getYear(date) == currentYear){
      for (let i = 1; i < 13; i++) {
        if(getMonth(date) == i){
          upSin[i].push(sin)
        }
      }
    }
  })
  let sinsPerMonth ={}
  const months= ["Janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
  upSin.map((el,id)=>{
    const key= months[id-1]
    sinsPerMonth= {...sinsPerMonth, [key]: el.length}
    // sinsPerMonth.push({[key]: el.length})
  })
  return sinsPerMonth
}

const getGraph6 = (sinis,year)=>{
  const currentDate = new Date();
  const currentYear = year ? year : currentDate.getFullYear()
  return {
    "months": PrepareMonthData(sinis,currentYear),
    "days": PrepareDayData(sinis),
  }
}
const getGraph7 = (sinis)=>{
    let somme=0.0
    sinis.map((sin)=>{
        if((parseFloat(sin.CHARGE_REELLE))){
            somme= somme+parseFloat(sin.CHARGE_REELLE)
        } else {
            // console.log(sin.CHARGE_REELLE)
        }
    })
    const moy= Math.round(somme/sinis.length)
    return separateurMilier(moy) + " €"
}
const getSommeMontant = (arr)=>{
  let somme = 0
  arr.map(sin=>{
      somme= somme + parseFloat(sin.CHARGE_REELLE)
  })
  return somme
}

const getGraph8 = (sinis)=>{
  const names=[]
  const upArr=[]
  const nameSet = new Set();
  sinis.forEach(obj => {
  if(obj.CONDUCTEUR){
      if (!nameSet.has(obj.CONDUCTEUR)) {
          nameSet.add(obj.CONDUCTEUR);
          names.push(obj.CONDUCTEUR)
      }
  } 
  });
  names.map((chauffeur,id)=>{
      const obj= {name:"", data:[]}
      obj.name= chauffeur
      sinis.map((sin)=>{
          if(sin.CONDUCTEUR == chauffeur){
              obj.data=[...obj.data,sin]
          }
      })
      upArr[id]= obj
  })
  const filterChauffeurs = upArr.filter(el =>el.data.length >= 2)

  const upChauffeurs = []
  filterChauffeurs.map((chauffeur)=>{
      upChauffeurs.push({"Nom du chauffeur":chauffeur.name,"Région":chauffeur.data[0].REGION,"Société":chauffeur.data[0].SOCIETE,"Montant": getSommeMontant(chauffeur?.data),"Nbre. sinistres":chauffeur.data?.length})
  })
  return upChauffeurs   
}

const getGraph9 = (sinis,props) =>{
  let filtreStr
  if(props?.societe){ filtreStr= "SITE"}
  else if(props?.region){ filtreStr= "SOCIETE"}
  else { filtreStr= "REGION"}
  const arr=[]
  let upArr={}
  const nameSet = new Set();
  sinis.forEach(obj => {
      if (!nameSet.has(obj[filtreStr])) {
          nameSet.add(obj[filtreStr]);
            arr.push(obj[filtreStr] !== null ? obj[filtreStr] : "Indeterminé")
      }
  });
  if(arr.length>0){
    arr.map((value,id)=>{
      let somme = 0
      sinis.map((sin)=>{
        if(sin[filtreStr]?.toUpperCase() == value?.toUpperCase() ){
          if(! isNaN(parseFloat(sin.CHARGE_REELLE))){
            somme= somme + (parseFloat(sin.CHARGE_REELLE))
          }
        }
      })
      upArr = {...upArr, [arr[id]]: Math.round(somme)}
    })
  }
    return upArr
}

const getGraph10 = (sinis) =>{
  const upArr=[]
  const cas=['Arret', 'Manoeuvre', 'En_Circulation', 'Aucun']
  const nameSet = new Set();
  let sommeIndet = 0
  sinis.forEach(obj => {
    if(obj.CAS == null){
          sommeIndet = sommeIndet+1
    }
  });

  cas.map((casEL,id)=>{
    let somme = 0
      sinis.map((sin)=>{
        if(sin.CAS){
          if(sin.CAS == casEL ){
            somme= somme+1
          } 
        }
      })
      upArr[id]= somme
    })
  
  upArr[3]= upArr[3]+ sommeIndet
  const updatedArray = cas.map(item => {
    if (item === "Aucun") {
      return "Indéterminé";
    }
    return item;
  });

  let arrData = []
    upArr.map((el,id)=>{
      arrData[id] = { [updatedArray[id]] : el*100/sinis.length}
    })
  return {nbe:upArr,'%': arrData}
}

const getGraph11 = (sinis) => {
  const cas=["Responsable","Non responsable", "Partagée","Indéterminé"]
  let upArr=[]
  let s1=0
  let s2=0
  let s3=0
  let s4=0
  let tabPer=[]
  let tabNbr=[]
  let partagee= []
  // if(type == '%'){
    sinis.map((sin)=>{
        if(sin.POURCENTAGE_RC == 100){
            s1 = s1+1
        } else if (sin.POURCENTAGE_RC == 0){
            s2= s2+1
        } else if(sin.POURCENTAGE_RC == 50){
            s3=s3+1
            partagee.push(sin.DATE_SURVENANCE)
        } else{
          s4=s4+1
        }
    })
    // console.log('partagee',partagee)
   const ps1 = Math.round(s1 * 100 / sinis.length)
   const ps2 = Math.round(s2 * 100 / sinis.length)
   const ps3 = Math.round(s3 * 100 / sinis.length)
   const ps4 = Math.round(s4 * 100 / sinis.length)

   tabPer=[
      {title:"Responsable",value: s1, percentage:ps1},
      {title:"Non responsable",value: s2, percentage:ps2},
      {title:"Partagée",value: s3, percentage:ps3},
      {title:"Indéterminé",value: s4, percentage:ps4},
    ]
  // } else {
    sinis.map((sin)=>{
      if(sin.POURCENTAGE_RC == 100){
          s1 =!isNaN(parseFloat(sin.CHARGE_REELLE)) ? Math.round(s1+ parseFloat(sin.CHARGE_REELLE)) : s1
      } else if (sin.POURCENTAGE_RC == 0){
          s2=!isNaN(parseFloat(sin.CHARGE_REELLE)) ?  Math.round(s2+ parseFloat(sin.CHARGE_REELLE)) : s2
      } else if(sin.POURCENTAGE_RC == 50){
          s3=!isNaN(parseFloat(sin.CHARGE_REELLE)) ? Math.round(s3+ parseFloat(sin.CHARGE_REELLE)) : s3
      } else {
        s4=0
      }
    })
    let sommeNbr = s1+s2+s3+s4
    const nps1 = Math.round(s1 * 100 / sommeNbr)
    const nps2 = Math.round(s2 * 100 / sommeNbr)
    const nps3 = Math.round(s3 * 100 / sommeNbr)
    const nps4 = Math.round(s4 * 100 / sommeNbr)
    tabNbr=[
      {title:"Responsable", value: separateurMilier(s1),percentage: nps1},
      {title:"Non responsable", value:separateurMilier(s2),percentage: nps2},
      {title:"Partagée", value:separateurMilier(s3),percentage: nps3},
      {title:"Indéterminé", value:separateurMilier(s4),percentage: nps4},
    ]
  upArr=[s1,s2,s3,s4]
  return {'nbr': tabNbr, '%': tabPer}
}

const getGraph12 = (sinis) =>{
  const upSin = []
  const currentDate = new Date();
  // const currentYear = currentDate.getFullYear();
  const currentYear = '2023'

  const week=["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"]
  for(let key in week){
    const upJour =upSin[key] ? [...upSin[key]] : []
    sinis.map((sin)=>{
      const date= sin.DATE_SURVENANCE 
      if(getYear(date) == currentYear){
        if(getDayName(date) == week[key]){
            // console.log(getDayName(date) ,week[key])
            upJour.push(sin)
            upSin[key] = upJour
          }
      }
    })
  }
  const responsable =[]
  const nonResponsable =[]
  const responsabilitePartagee = []
  const autres = []
  const result=[]
  upSin.map(el=>{
      const nbre= el.length
      let s1=0
      let s2=0
      let s3=0
      let s4=0
      el.map((sin)=>{
          if(sin.POURCENTAGE_RC == 100){
              s1= s1+1
          }
          else if(sin.POURCENTAGE_RC == 0){
              s2= s2+1
          }
          else if(sin.POURCENTAGE_RC  == 50){
              s3= s3+1
          }  else {
              s4= s4+1
          }
      })
      // console.log('respo',s1,s2,s3,s4)
      result.push({nbre: el.length,respo: s1, nonResp: s2, partagee:s3,autres:s4})
      responsable.push(s1*100/nbre)
      nonResponsable.push(s2*100/nbre)
      responsabilitePartagee.push(s3*100/nbre)
      autres.push(s4*100/nbre)
  })

  const res=[]
  week.map((day,id)=>{
    res.push({[day]: {'responsable': responsable[id], 'nonResponsable': nonResponsable[id], 'responsabilitePartagee': responsabilitePartagee[id], 'Indétérminé': autres[id] } })
  })
  return res
}

const getGraph13 = (sinis) =>{
  const upSin = []
  const nbrArr = []
  const hours=[ 'Entre_3h_6h','Entre_6h_9h','Entre_9h_11h','Entre_11h_13h','Entre_13h_15h','Entre_15h_17h','Entre_17h_19h','Entre_19h_22h','Entre_22h_3h','Aucun']
  let total=0
  const erronedValues=[]
  for(let key in hours){
    let s=0
      sinis.map((sin,id)=>{
          if(hours[key] == sin.HEURE){
              s=s+1
          }
      })
        nbrArr[key]= { [hours[key]] : s }
        upSin[key]= { [hours[key]] : s*100/sinis.length }
        total=total+upSin[key]
  }
  return { 'nbr': nbrArr, '%': upSin}
}

const getGraph14 = (sinis) =>{
  const upSin=[]
  sinis.filter((sin,key)=> {
      let x=0
      if(sin.CHARGE_REELLE && sin.MONTANT_RECOURS){
           x= (sin.CHARGE_REELLE - sin.MONTANT_RECOURS) / 1
      }
      upSin[key] = x
      // (Charge Sinistre - Montant Conservation HT) / Prime HT
  })
  return upSin
}
const getCurrentYear = ()=>{
  const currentDate = new Date();
 return currentDate.getFullYear();
}
const getGraph17_1 = (sinis) =>{
  const years=[]
  const upArr=[]
  const nameSet = new Set();

  sinis.forEach(obj => {
      if(obj.PREMIERE_MEC){
          let year=getYear(obj.PREMIERE_MEC)
          year= parseInt(year)
          if(year && (year>2000)){
              if (!nameSet.has(year)) {
                  nameSet.add(year);
                  years.push(year)
              }
          } 
      }
  });

  years.sort((a, b) => a - b);
  const lastyears=years.filter(el=>el> getCurrentYear()-4 )
  const otheryears= getCurrentYear()-4
  const upYears=[otheryears,...lastyears]

  const upSin=[]
  upYears.map((el,key)=>{
      let s=0
      sinis.map((sin)=>{
          if(key == 0){
              if(getYear(sin.PREMIERE_MEC) < otheryears){
                  s=s+1
              }
          } else {
              if(getYear(sin.PREMIERE_MEC) == el){
                  s=s+1
              }
          }
      })
      upSin[key]= s
  })


  const tab=[]
  const sum = upSin.reduce((a, b) => a + b, 0);
  
  upSin.map((el,id)=>{
      tab.push({title:upYears[id],value:el, percentage:Math.round((el / sum) * 100)})
  })
  return tab
}
const getGraph17_2 = (sinis) =>{
  const names=[]
  const upArr=[]
  sinis.map((sin,key)=>{
      const CR= parseInt(sin.CHARGE_REELLE)
      if(!isNaN(CR)){
          upArr.push([CR,sin.CONDUCTEUR,sin.REGION,sin.SOCIETE,sin.DATE_SURVENANCE])
      }
  })
  upArr.sort((a, b) => a[0] - b[0]);
  const firstFiveArrays = upArr.slice(-5).sort((a, b) => b - a);
  const headers =["charge réelle","Conducteur","Région","Société","Date de survenance"]

  const res= []
  firstFiveArrays.map((el,id)=>{
    res.push({[headers[id]]: el})
  })
  return res
}


exports.getGraphs = async (req, res, next) => {
  // console.log('annee ',req.body)
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
    const sinistres = await prisma.declarationSinistre.findMany({
      where: {
        ...obj
      }
    })
    const client= await prisma.client.findUnique({
      where:{id: 1},
      include:{
        objectifs: true
      }
    })
    // console.log('client: ',objectif)
    let objectif
    if(req.body.annee){
      const chosenObjectif= client.objectifs.find(obj => obj.year == req.body.annee)
      objectif = chosenObjectif?.value
    } else {
      const chosenObjectif= client.objectifs.find(obj => obj.year == new Date().getFullYear())
      objectif = chosenObjectif ? chosenObjectif?.value : client.objectifs[0]?.value
    }

    const sinis=removeDoubles(sinistres)

    const graph4 = getGraph4(sinistres)
      let dashbord = {
        "Nombre de sinistres" : {"tous":sinistres.length, "sansDoublons": sinis.length},
        "Nbr. sinistres par jour": getGraph2(sinistres,parseInt(req.body.annee)),
        "Objectifs charge sinistres": getGraph3(objectif),
        "Charge estimée": graph4,
        "Coût Sinistre Moyen": getGraph7(sinistres),
        "Répartition des sinistres par": getGraph9(sinistres,req.body.body),
        "Répartition des sinistres par cas": getGraph10(sinistres),
        "Taux de respect de l'objectif": getGraph5(graph4, objectif),
        'Top 5 sinistres': getGraph17_2(sinistres),
        "Saisonnalité de la fréquence sinistre": getGraph6(sinistres, req.body.annee),
        "Liste Chauffeur Récidiviste": getGraph8(sinistres),
        "Responsabilité": getGraph11(sinistres),
        "Jour de la semaine vs Responsabilité": getGraph12(sinistres),
        'Année de véhicule': getGraph17_1(sinistres),
        "Sinistres par plages horaires": getGraph13(sinistres),
      }

      res.status(200).json(dashbord)
  } catch (error) {
      res.status(404).json({ error: next(error) })
  }
}
