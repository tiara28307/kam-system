const Logger = require('../../logger/logger');
const log = new Logger('Email-Dao');
var nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = (body, res) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tncarroll99@gmail.com',
      pass: `${process.env.EMAIL_PASS}`
    }
  }); 

  var mailOptions = {
    from: `New user: ${body.fullName}`, //replace with your email
    to: 'tncarroll99@gmail.com', //replace with your email
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
