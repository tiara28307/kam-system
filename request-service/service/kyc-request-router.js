var express = require('express');
var cors = require('../cors');
const Logger = require('../logger/logger');
const log = new Logger('KYC-Onboarding-Service');
const kycRequestRouter = express.Router();
// const kycOnboardingDao = require('./kyc-onboarding-dao');

kycRequestRouter
  /*.get('/', cors.cors, (req, res, next) => {
    res.send({
      message: 'Hello!'
    })
  })*/
  .get('/', (req, res) => res.send('hello'))

module.exports = kycRequestRouter;
