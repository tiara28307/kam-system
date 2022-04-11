var express = require('express');
var cors = require('../cors');
const Logger = require('../logger/logger');
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

  .post('/create/application', cors.cors, (req, res, next) => {
    let newApplication = req.body;
    
    kycOnboardingDao.createNewApplication(newApplication, res)
      .then()
      .catch(err => {
        log.error('Error in creating new application: ' + err);
      });
  })

  .get('/customer/:customerId/application', cors.cors, (req, res, next) => {
    let customerId = req.params.customerId;

    kycOnboardingDao.getApplication(customerId, res)
      .then()
      .catch(err => {
        log.error('Error in retrieving application: ' + err);
      });
  })

  .post('/update/applicationdetails', cors.cors, (req, res, next) => {
    let detailsObj = req.body;

    kycOnboardingDao.updateApplicationDetails(detailsObj, res)
      .then()
      .catch(err => {
        log.error('Error in updating application details: ' + err);
      });
  })

  .post('/delete/application', cors.cors, (req, res, next) => {
    let applicationId = req.body;

    kycOnboardingDao.deleteApplication(applicationId, res)
      .then()
      .catch(err => {
        log.error('Error in deleting application: ' + err);
      });
  })

module.exports = kycOnboardingRouter;
