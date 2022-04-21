var express = require('express');
var cors = require('../../cors');
const Logger = require('../../logger/logger');
const log = new Logger('Register-Service');
const pubRequestRouter = express.Router();
const pubRequestController = require('./pub-request-controller');

pubRequestRouter
  .get('/confirm/pubhome', cors.cors, (req, res, next) => {
    pubRequestController.request(req, res);
  })

  .post('/create', cors.cors, (req, res, next) => {
    pubRequestController.createRequest(req, res);
  })

module.exports = pubRequestRouter;
