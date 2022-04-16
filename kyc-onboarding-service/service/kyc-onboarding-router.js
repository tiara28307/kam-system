var express = require('express');
var cors = require('../cors');
const Logger = require('../logger/logger');
const log = new Logger('KYC-Onboarding-Service');
const kycOnboardingRouter = express.Router();
const kycOnboardingDao = require('./kyc-onboarding-dao');
const { upload } = require('../multer-storage');

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

  .get('/customer/:customerId/application/exist', cors.cors, (req, res, next) => {
    let customerId = req.params.customerId;

    kycOnboardingDao.applicationExist(customerId, res)
      .then()
      .catch(err => {
        log.error('Error in checking existence of application: ' + err);
      })
  })

  .post('/delete/application/:applicationId', cors.cors, (req, res, next) => {
    let applicationId = req.params.applicationId;

    kycOnboardingDao.deleteApplication(applicationId, res)
      .then()
      .catch(err => {
        log.error('Error in deleting application: ' + err);
      });
  })

  /*.post('/upload/application/:applicationId/document/:documentType', upload.single('file'), cors.cors, (req, res) => {
      kycOnboardingDao.uploadDocument(req, res)
        .then()
        .catch(err => {
          log.error('Error in uploading document: ', err);
        })
  })*/

  .post('/update/application/:applicationId/document/:documentType', upload.single('file'), cors.cors, (req, res) => {
    kycOnboardingDao.updateDocument(req, res)
      .then()
      .catch(err => {
        log.error('Error in uploading document: ', err);
      })
})

module.exports = kycOnboardingRouter;
