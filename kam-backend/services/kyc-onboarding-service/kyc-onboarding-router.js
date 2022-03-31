var express = require('express');
var cors = require('../../cors');
const Logger = require('../../logger/logger');
const log = new Logger('KYC-Onboarding-Service');
const kycOnboardingRouter = express.Router();
const kycOnboardingDao = require('./kyc-onboarding-dao');

kycOnboardingRouter
  .get('/peptypes', cors.cors, (req, res, next) => {
    kycOnboardingDao.getAllPepTypes(res)
      .then()
      .catch(err => {
        log.error('Error in retrieving pep types: ' + err);
      });
  })

module.exports = kycOnboardingRouter;
