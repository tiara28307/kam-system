var express = require('express');
var cors = require('../cors');
const Logger = require('../logger/logger');
const log = new Logger('KYC-Screening-Service');
const kycScreeningRouter = express.Router();
const kycScreeningDao = require('./kyc-screening-dao');
const { upload } = require('../multer-storage');

kycScreeningRouter
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

  .get('/individual/sanctions', cors.cors, (req, res, next) => {
    kycScreeningDao.individualSanction(req, res)
      .then()
      .catch(err => {
        log.error('Error in getting individual risk assessment: ', err);
      })
  })

  .get('/business/sanctions', cors.cors, (req, res, next) => {
    kycScreeningDao.businessSanction(req, res)
      .then()
      .catch(err => {
        log.error('Error in getting individual risk assessment: ', err);
      })
  })

module.exports = kycScreeningRouter;
