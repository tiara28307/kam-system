const Logger = require('../logger/logger');
const log = new Logger('KYC-Onboarding-Dao');
const mongoose = require('mongoose');
const Application = require('./kyc-onboarding-schema-model').Application;
const PepType = require('./kyc-onboarding-schema-model').PepType;
const KycDocument = require('./kyc-onboarding-schema-model').KycDocument;
const fs = require('fs');

// const web3 = require('../blockchain/web3-storage');

const dbUrl = process.env.MONGODB_KOS_URL;

// Connect to KYC Onboarding Service (KOS) Database
mongoose.connect(dbUrl)
        .then(log.info('connected to mongo kos database....'))
        .catch(err => log.error('unable to connect, please check your connection....' + err));

// TODO: Connect to Web3.Storage Blockchain

function getCurrentDateTime() {
  return new Date().toUTCString();
}

function generateApplicationId() {
  let uuid = Math.floor(new Date().valueOf() * Math.random());
  let appId = 'K' + uuid.toString().slice(-8);
  return appId;
}

function setApplicationDetails(applicationType) {
  if (applicationType === 'INDIVIDUAL') {
    return {
      first_name: '',
      last_name: '',
      maiden_name: '',
      father_name: '',
      mother_name: '',
      mother_maidenname: '',
      spouse_name: '',
      marital_status: '',
      gender: '',
      dob: '',
      citizenship_status: '',
      occupation: '',
      pep: '',
      rca_pep: '',
      pep_exposure: '',
      current_address: {
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: ''
      },
      permanent_address: {
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: ''
      },
      email: '',
      phone: '',
      declared: false
    }
  } else if (applicationType === 'BUSINESS') {
    return {
      company_name: '',
      employee_firstname: '',
      employee_lastname: '',
      date_incorporation: '',
      state_incorporation: '',
      registration_number: '',
      date_commencement: '',
      company_type: '',
      company_address: {
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: ''
      },
      emp_email: '',
      emp_phone: '',
      declared: false
    }
  }
}

function setDocuments(applicationType) {
  if (applicationType === 'INDIVIDUAL') {
    return {
      poi: [],
      poa: []
    }
  } else if (applicationType === 'BUSINESS') {
    return {
      poi: [],
      poa: []
    }
  }
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
  let appDetails = setApplicationDetails(applicationDetails.type);
  let documentDetails = setDocuments(applicationDetails.type)
  
  let newApplication = new Application({
    application_id: applicationId,
    customer_id: applicationDetails.customerId,
    application_cids: null,
    creation_date: date,
    last_modified: date,
    application_type: applicationDetails.type,
    details: [appDetails],
    documents: [documentDetails],
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

const applicationExist = async (customerId, res) => {
  try {
    const result = await Application.findOne({ customer_id: customerId }).count();
    log.info(`Check if application exist successful: `, result);

    return res.send({
      messageCode: 'APPEXI',
      message: 'Check if application exist for customer.',
      exists: result > 0
    });
  } catch (err) {
    log.error(`Error checking if application exist: ` + err);
    
    return res.status(400).send({
      messageCode: 'APPEXIERR',
      message: 'Unable to check if application exist'
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
    const resultDocumentsDel = await Application.findOne({ application_id: applicationId });
    let documentsDirPath = resultDocumentsDel.documents[0].poi.file_desc;
    let dirPathExist = fs.existsSync(documentsDirPath);

    if (dirPathExist) {
      fs.rmSync(documentsDirPath, { recursive: true }, (err) => {
        if (err) {
          log.error(`Error deleting document directory ${documentsDirPath}: `, err);
        }
        log.info(`Deletion of directory at ${documentsDirPath} was successful!`);
      });
    }

    const resultDel = await Application.findOneAndRemove({ application_id: applicationId });
    log.info(`Application ${applicationId} has been successfully deleted.`);
    
    return res.send({
      messageCode: 'DELAPP',
      message: `Application ${resultDel.application_id} has been successfully deleted`,
    });
  } catch (err) {
    log.error(`Error in deleting application ${applicationId}: ` + err);
    
    return res.status(400).send({
      messageCode: 'DELAPPERR',
      message: 'Unable to delete application ' + applicationId
    });
  }
}

const updateDocument = async (documentObj, res) => {
  let date = getCurrentDateTime();

  let newDocument = new KycDocument({
    doc_id: documentObj.file.filename.slice(0, 9),
    file_name: documentObj.file.filename,
    file_path: documentObj.file.path,
    file_desc: documentObj.file.destination,
    original_name: documentObj.file.originalname,
    uploaded: date
  });

  // Save new document to mongodb
  try {
    let type = documentObj.params.documentType;
    var result;

    if (type === 'poi') {
      result = await Application.findOneAndUpdate(
        { application_id: documentObj.params.applicationId }, 
        { $set: { 
          'documents.0.poi': newDocument, 
          last_modified: date 
        }},
        { returnDocument: true }
      );
    } else if (type === 'poa') {
      result = await Application.findOneAndUpdate(
        { application_id: documentObj.params.applicationId }, 
        { $set: { 
          'documents.0.poa': newDocument, 
          last_modified: date 
        }},
        { returnDocument: true }
      );
    } else {
      return res.status(400).send({
        messageCode: 'UPLDOCERR',
        message: 'Unable to upload document. Invalid document type.'
      });
    }

    log.info(`POI Document for ${result.application_id} has been uploaded to database`);

    // Remove old file from directory
    let oldFilePath = type === 'poi' ? './' + result.documents[0].poi.file_path : './' + result.documents[0].poa.file_path;
    oldPathExist = fs.existsSync(oldFilePath);
    
    if (oldPathExist) {
      fs.unlinkSync(oldFilePath, (err) => {
        if (err) {
          log.error(`Error removing document at ${oldFilePath}: `, err);
        }
        log.info(`Removal of file at ${oldFilePath} successful!`);
      })
    }

    return res.send({
      messageCode: 'UPLDOC',
      message: 'Updated document for application ' + result.application_id
    });
  } catch (err) {
    log.error(`Error in uploading document to database`);

    return res.status(400).send({
      messageCode: 'UPLDOCERR',
      message: 'Unable to upload document to database'
    });
  }
}

// DAO - submit (push) application to blockchain
const submitApplication = async (applicationDetails, res) => {
  // update application submitted = true; submission_date 
  // send to Web3.Storage
  // store application cid
}

// DAO - get applcation CID by application ID
const getSubmittedApplication = async (applicationId, res) => {
  
}

module.exports = {
    getAllPepTypes,
    createNewApplication,
    getApplication,
    updateApplicationDetails,
    deleteApplication,
    submitApplication,
    getSubmittedApplication,
    applicationExist,
    // uploadDocument,
    updateDocument
}