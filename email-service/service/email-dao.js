const Logger = require('../logger/logger');
const log = new Logger('Email-Dao');
var nodemailer = require('nodemailer');
require('dotenv').config();

// DAO to send email via Nodemailer Transport
const sendEmail = (body, res) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tncarroll99@gmail.com',
      pass: `${process.env.EMAIL_PASS}`
    }
  }); 

  var mailOptions = {
    from: `New user: ${body.fullName}`,
    to: 'tncarroll99@gmail.com',
    subject: `KAM System Consultation`,
    html:`<ul>
        <li>Name: ${body.fullName}</li>
        <li>Email: ${body.email}</li>
        <li>Message: ${body.message}</li>
      </ul>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      log.error('Error: ', error);
    } else {
      res.send('Sent Successfully');
      log.info('Email sent ', info.response);
    }
  });
}

module.exports = { sendEmail }
