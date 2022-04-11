const Logger = require('../logger/logger');
const log = new Logger('KYC-Onboarding-Dao');
const mongoose = require('mongoose');
const PepType = require('./kyc-onboarding-schema-model').PepType;
const Application = require('./kyc-onboarding-schema-model').Application;

const dbUrl = process.env.MONGODB_KOS_URL;

// Connect to KYC Onboarding Service (KOS) Database
mongoose.connect(dbUrl)
        .then(log.info('connected to mongo kos database....'))
        .catch(err => log.error('unable to connect, please check your connection....' + err));

// TODO: Connect to Web3.Storage Blockchain

function getCurrentDateTime() {
  return new Date();
}

function generateApplicationId() {
  let uuid = Math.floor(new Date().valueOf() * Math.random());
  let appId = 'K' + uuid.toString().slice(-8);
  return appId;
}

// DAO to get all politically exposed person types
const getAllPepTypes = async (res) => {
  var pepTypesMap = [];
  return await PepType.find({})
    .then(types => {
      types.forEach(type => {
        pepTypesMap.push({
          code: type.code,
          name: type.name,
          risk: type.risk_level
        });
      });
      return res.send({ pepTypesMap });
    })
    .catch(err => {
      throw new Error(err);
    });
}

// DAO - create new customer application
const createNewApplication = async (applicationDetails, res) => {
  let date = getCurrentDateTime();
  let applicationId = generateApplicationId();
  
  let newApplication = new Application({
    application_id: applicationId,
    customer_id: applicationDetails.customerId,
    application_cids: null,
    creation_date: date,
    last_modified: date,
    application_type: applicationDetails.type,
    details: [],
    submitted: false,
    submission_date: null
  });

  // Save new application to mongodb
  try {
    const result = await newApplication.save();
    log.info(`Application ${result.application_id} has been created for customer ${result.customer_id}`);

    return res.send({
      messageCode: 'CREAPP',
      message: `Application ${result.application_id} has been successfully created.`
    });
  } catch (err) {
    log.error(`Error in creating new application for customer ${applicationDetails.customerId}: ` + err);
      return res.status(400).send({
        messageCode: 'CREAPPERR',
        message: 'Unable to create new application for customer ' + applicationDetails.customerId
      });
  }
}

// DAO - get application by customer ID (username)
const getApplication = async (customerId, res) => {
  try {
    const result =  await Application.findOne({ customer_id: customerId });
    log.info(`Application ${result.application_id} has been retrieved for customer ${result.customer_id}`);
    
    return res.send({
      messageCode: 'GETAPP',
      message: 'Application has been retrieved successfully.',
      applicationDetails: result
    });
  } catch (err) {
    log.error(`Error retrieving application for customer ${customerId}: ` + err);
    
    return res.status(400).send({
      messageCode: 'GETAPPERR',
      message: 'Unable to retrieve application for customer ' + customerId
    });
  }
}

// DAO - update exisintg application by application ID
const updateApplicationDetails = async (detailsObj, res) => {
  let date = getCurrentDateTime();

  try {
    const result = await Application.findOneAndUpdate({ application_id: detailsObj.applicationId }, { $set: { details: detailsObj.details, last_modified: date } });
    log.info(`Application ${result.application_id} details have been updated`);
    
    return res.send({
      messageCode: 'UPDAPP',
      message: 'Updated details for application ' + result.application_id
    });
  } catch (err) {
    log.error(`Error updating details for application ${detailsObj.applicationId}: ` + err);
    
    return res.status(400).send({
      messageCode: 'UPDAPPERR',
      message: 'Unable to update application details' + detailsObj.applicationId
    });
  }
}

// DAO - delete application by application ID
const deleteApplication = async (applicationId, res) => {
  try {
    const result = await Application.findOneAndRemove({ application_id: applicationId });
    log.info(`Application ${applicationId} has been successfully deleted.`);
    
    return res.send({
      messageCode: 'DELAPP',
      message: `Application has been successfully deleted.`
    });
  } catch (err) {
    log.error(`Error in deleting application ${applicationId}: ` + err);
    
    return res.status(400).send({
      messageCode: 'DELAPPERR',
      message: 'Unable to delete application ' + applicationId
    });
  }
}

// DAO - submit (push) application to blockchain
const submitApplication = async (applicationDetails, res) => {
  // update application submitted = true; submission_date 
  // send to Web3.Storage
}

// DAO - store application CID from blockchain to mongodb
const addApplicationCID = async (cidObj, res) => {

}

// DAO - get applcation CID by application ID
const getApplicationCID = async (applicationId, res) => {

}

// DAO - get all application CIDs by application ID
const getAllApplicationCID = async (applicationId, res) => {

}

module.exports = {
    getAllPepTypes,
    createNewApplication,
    getApplication,
    updateApplicationDetails,
    deleteApplication,
    submitApplication,
    addApplicationCID,
    getApplicationCID,
    getAllApplicationCID
}