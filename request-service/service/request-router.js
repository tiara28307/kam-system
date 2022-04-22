var express = require('express');
var cors = require('../cors');
const Logger = require('../logger/logger');
const log = new Logger('Request-Service');
const requestRouter = express.Router();
const requestDao = require('./request-dao');

requestRouter
  .post('/new', cors.cors, (req, res, next) => {
    let reqObj = req.body;

    requestDao.createNewRequest(reqObj, res)
      .then()
      .catch(err => {
        log.error('Error in creating new request');
      });
  })

  .get('/all/user/:type/:email', cors.cors, (req, res, next) => {
    let reqObj = {
      userType: req.params.type,
      email: req.params.email
    }

    requestDao.getRequests(reqObj, res)
      .then()
      .catch(err => {
        log.error('Error in retrieving all requests for user: ' + err);
      });
  })

  .post('/update', cors.cors, (req, res, next) => {
    let reqObj = req.body;

    requestDao.updateRequest(reqObj, res)
      .then()
      .catch(err => {
        log.error('Error in updating request: ' + err);
      });
  })

module.exports = requestRouter;
