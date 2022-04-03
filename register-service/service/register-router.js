var express = require('express');
var cors = require('../cors');
const Logger = require('../logger/logger');
const log = new Logger('Register-Service');
const registerRouter = express.Router();
const registerDao = require('./register-dao');

registerRouter
  .get('/companytypes', cors.cors, (req, res, next) => {
    registerDao.getAllCompanyTypes(res)
      .then()
      .catch(err => {
        log.error('Error in retrieving company types: ' + err);
      });
  })

  .get('/countries', cors.cors, (req, res, next) => {
    registerDao.getAllCountries(res)
      .then()
      .catch(err => {
        log.error('Error in retrieving countries: ' + err);
      });
  })

module.exports = registerRouter;
