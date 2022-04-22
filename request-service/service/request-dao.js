const Logger = require('../logger/logger');
const log = new Logger('Request-Dao');
const mongoose = require('mongoose');
const Request = require('./request-schema-model').Request;

const dbUrl = process.env.MONGODB_REQ_URL;

// Connect to Request Service Database
mongoose.connect(dbUrl)
        .then(log.info('connected to mongo request database....'))
        .catch(err => log.error('unable to connect, please check your connection....' + err));

function getCurrentDateTime() {
  return new Date().toUTCString();
}

function generateRequestId() {
  let uuid = Math.floor(new Date().valueOf() * Math.random());
  let reqId = 'R' + uuid.toString().slice(-8);
  return reqId;
}

const createNewRequest = async (reqObj, res) => {
  let date = getCurrentDateTime();
  let requestId = generateRequestId();
  
  let newRequest = new Request({
    request_id: requestId,
    applicant_email: reqObj.applicantEmail,
    company_name: reqObj.companyName,
    sender: reqObj.sender,
    job_title: reqObj.jobTitle,
    sender_email: reqObj.senderEmail,
    message: reqObj.message,
    status: 'PENDING',
    request_date: date,
    application_id: '',
    app_cid: '',
    poi_file: '',
    poa_file: ''
  });

  // Save new request to mongodb
  try {
    const result = await newRequest.save();
    log.info(`Request ${result.request_id} has been created.`);

    return res.send({
      messageCode: 'CREREQ',
      message: `Request ${result.request_id} has been successfully created.`
    });
  } catch (err) {
    log.error(`Error in creating new request: ` + err);
      return res.status(400).send({
        messageCode: 'CREREQERR',
        message: 'Unable to create new request'
      });
  }
}

const getRequests = async (reqObj, res) => {
  try {
    const userType = reqObj.userType; // CUSTOMER or COMPANY

    if (userType === 'CUSTOMER') {
      const result = await Request.find({ applicant_email: reqObj.email });
      log.info(`Requests for ${reqObj.email} retrieved`);
      console.log(result);

      return res.send({
        messageCode: 'GETREQ',
        message: 'Requests have been retrieved successfully.',
        requests: result
      });
    } else if (userType === 'COMPANY') {
      const result = await Request.find({ sender_email: reqObj.email });
      log.info(`Requests for ${reqObj.email} retrieved`);
      console.log(result);

      return res.send({
        messageCode: 'GETREQ',
        message: 'Requests have been retrieved successfully.',
        requests: result
      });
    }
  } catch (err) {
    log.error(`Error retrieving requests for ${reqObj.email}: ` + err);
    
    return res.status(400).send({
      messageCode: 'GETAPPERR',
      message: 'Unable to retrieve requests for ' + reqObj.email
    });
  }
}

const updateRequest = async (reqObj, res) => {
  try {
    const result = await Request.findOneAndUpdate({ request_id: reqObj.requestId }, 
      { $set: { 
        status: reqObj.status, 
        application_id: reqObj.applicationId, 
        app_cid: reqObj.cid,
        poi_file: reqObj.poiFilename,
        poa_file: reqObj.poaFilename
      }}
    )
    log.info(`Request ${result.request_id} was successfully updated.`);

    return res.send({
      messageCode: 'UPDREQ',
      message: 'Updated request ' + result.request_id
    });
  } catch (err) {
    log.error(`Error updating request ${reqObj.requestId}: ` + err);
    
    return res.status(400).send({
      messageCode: 'UPDREQERR',
      message: 'Unable to update request' + reqObj.requestId
    });
  }
}

module.exports = {
  createNewRequest,
  getRequests,
  updateRequest
}