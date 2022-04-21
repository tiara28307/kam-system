var express = require('express');
var cors = require('../../../cors');
const Logger = require('../../../logger/logger');
const log = new Logger('Register-Service');
const subRequestRouter = express.Router();
const subRequestController = require('./sub-request-controller');

subRequestRouter
  .get('/confirm/subhome', cors.cors, (req, res, next) => {
    subRequestController.subscribeRequestHome(req, res);
  })

  .post('/pull', cors.cors, (req, res, next) => {
    subRequestController.pullRequest(req, res);
  })

  .post('/push', cors.cors, (req, res, next) => {
    subRequestController.pushRequest(req, res);
  })

module.exports = subRequestRouter;
