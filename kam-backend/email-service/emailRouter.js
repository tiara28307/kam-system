var express=require('express');
var cors = require('../cors');
const Logger = require('../logger/logger');
const log = new Logger('Email-Service');
const emailRouter = express.Router();
const emailDao = require('./email-dao');

emailRouter.route('/')
.options(cors.cors,(req,res)=>{
    res.sendStatus(200);
})

// route which captures form details and sends it to your personal mail
.post(cors.cors,(req,res,next)=>{
  let emailDetails = req.body;
  emailDao.sendEmail(emailDetails, res);
})


module.exports = emailRouter;