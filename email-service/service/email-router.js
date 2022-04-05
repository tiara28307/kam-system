var express = require('express');
var cors = require('../cors');
const Logger = require('../logger/logger');
const log = new Logger('Email-Service');
const emailRouter = express.Router();
const emailDao = require('./email-dao');

emailRouter
  .route('/')
  
  .options(cors.cors, (req, res) => {
      res.sendStatus(200);
  })

  .post(cors.cors, (req, res, next) => {
    let emailDetails = req.body;
    log.info('Sending email...')
    emailDao.sendEmail(emailDetails, res);
  })


module.exports = emailRouter;
