const nodemailer = require("nodemailer");
require("dotenv").config();
// async..await is not allowed in global scope, must use a wrapper
 function send_mail(mailOptions, recipient) {
  console.log('send mail fc')
  let transporter = nodemailer.createTransport({
    host: "ssl0.ovh.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SERVER_MAIL, // compte expéditeur
      pass: process.env.SERVER_MAIL_PASSWORD // mot de passe du compte expéditeur
    },
    tls: {
      rejectUnauthorized: true
    }
  });
  // send mail with defined transport object
  return transporter.sendMail(mailOptions)
  // let info = await transporter.sendMail(mailOptions);
  // console.log("Message sent:", info);
  // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // return info
}

//send_mail().catch(console.error);
module.exports = send_mail;