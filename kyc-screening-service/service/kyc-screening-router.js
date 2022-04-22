var express = require('express');
var cors = require('../cors');
const Logger = require('../logger/logger');
const log = new Logger('KYC-Screening-Service');
const kycScreeningRouter = express.Router();
const kycScreeningDao = require('./kyc-screening-dao');
const { upload } = require('../multer-storage');

kycScreeningRouter
  .post('/create/application', cors.cors, (req, res, next) => {
    let newApplication = req.body;
    
    kycScreeningDao.createNewApplicationRecord(newApplication, res)
      .then()
      .catch(err => {
        log.error('Error in creating new application: ' + err);
      });
  })

  .get('/company/:companyId/application', cors.cors, (req, res, next) => {
    let companyId = req.params.companyId;

    kycScreeningDao.getApplication(companyId, res)
      .then()
      .catch(err => {
        log.error('Error in retrieving application: ' + err);
      });
  })

  .get('/countries/incorporation', cors.cors, (req, res, next) => {
    kycScreeningDao.getIncorporationCountries(res)
      .then()
      .catch(err => {
        log.error('Error in retrieving countries of incorporation: ' + err);
      });
  })

  .get('/countries/government', cors.cors, (req, res, next) => {
    kycScreeningDao.getGovernmentCountries(res)
      .then()
      .catch(err => {
        log.error('Error in retrieving countries of government: ' + err);
      });
  })

  .get('/countries/nationality', cors.cors, (req, res, next) => {
    kycScreeningDao.getNationalityCountries(res)
      .then()
      .catch(err => {
        log.error('Error in retrieving countries of nationality: ' + err);
      });
  })

  .get('/countries/operation', cors.cors, (req, res, next) => {
    kycScreeningDao.getOperationCountries(res)
      .then()
      .catch(err => {
        log.error('Error in retrieving countries of operation: ' + err);
      });
  })

  .get('/countries/residence', cors.cors, (req, res, next) => {
    kycScreeningDao.getResidenceCountries(res)
      .then()
      .catch(err => {
        log.error('Error in retrieving countries of residence: ' + err);
      });
  })

  .get('/legalstructures', cors.cors, (req, res, next) => {
    kycScreeningDao.getLegalStructures(res)
      .then()
      .catch(err => {
        log.error('Error in retrieving legal structures: ' + err);
      });
  })

  .get('/individual/sanctions/:firstname/:lastname', cors.cors, (req, res, next) => {
    let personObj = {
      firstName: req.params.firstname,
      lastName: req.params.lastname
    }
    kycScreeningDao.individualSanctionScreening(personObj, res)
      .then()
      .catch(err => {
        log.error('Error in getting individual risk assessment: ', err);
      })
  })

  .get('/business/sanctions/:companyname', cors.cors, (req, res, next) => {
    let companyName = req.params.companyname;

    kycScreeningDao.businessSanctionScreening(companyName, res)
      .then()
      .catch(err => {
        log.error('Error in getting individual risk assessment: ', err);
      })
  })

  .post('/application/extraction/poi', cors.cors, (appObj, res, next) => {
    kycScreeningDao.extractIdentityInformation(appObj, res)
      .then()
      .catch(err => {
        log.error('Error in getting poi extracted details: ', err);
      })
  })

  .post('/application/extraction/poa', cors.cors, (appObj, res, next) => {
    kycScreeningDao.extractAddressInformation(appObj, res)
      .then()
      .catch(err => {
        log.error('Error in getting poa extracted details: ', err);
      })
  })

  .post('/update/application/poiextraction', cors.cors, (appObj, res, next) => {
    kycScreeningDao.updateApplicationPoiExtraction(appObj, res)
      .then()
      .catch(err => {
        log.error('Error in updating poi extraction: ', err);
      })
  })

  .post('/update/application/poaextraction', cors.cors, (appObj, res, next) => {
    kycScreeningDao.updateApplicationPoaExtraction(appObj, res)
      .then()
      .catch(err => {
        log.error('Error in updating poa extraction: ', err);
      })
  })

  .post('/update/application/decisionandcomments', cors.cors, (appObj, res, next) => {
    kycScreeningDao.updateApplicationDecisionComments(appObj, res)
      .then()
      .catch(err => {
        log.error('Error in updating decision and comments: ', err);
      })
  })

  .post('/update/application/riskscore', cors.cors, (appObj, res, next) => {
    kycScreeningDao.updateApplicationRiskScore(appObj, res)
      .then()
      .catch(err => {
        log.error('Error in updating risk score: ', err);
      })
  })

  .post('/share/application/:applicationId/decision', cors.cors, (req, res, next) => {
    let applicationId = req.params.applicationId;

    kycScreeningDao.shareApplicationDecision(applicationId, res)
      .then()
      .catch(err => {
        log.error('Error in sharing application decision: ' + err);
      });
  })

  .get('/company/:companyId/submitted/applicationdetails', cors.cors, (req, res, next) => {
    let companyId = req.params.companyId;
    kycScreeningDao.getSubmittedApplicationDetails(companyId, res)
      .then()
      .catch(err => {
        log.error('Error in getting submitted application details: ' + err);
      })
  })

  .get('/company/:companyId/submitted/poifile', cors.cors, (req, res, next) => {
    let companyId = req.params.companyId;
    kycScreeningDao.getSubmittedPoiFile(companyId, res)
      .then()
      .catch(err => {
        log.error('Error in getting submitted application details: ' + err);
      })
  })

  .get('/company/:companyId/submitted/poafile', cors.cors, (req, res, next) => {
    let companyId = req.params.companyId;
    kycScreeningDao.getSubmittedPoaFile(companyId, res)
      .then()
      .catch(err => {
        log.error('Error in getting submitted application details: ' + err);
      })
  })

module.exports = kycScreeningRouter;
