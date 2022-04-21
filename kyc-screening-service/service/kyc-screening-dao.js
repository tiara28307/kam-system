const Logger = require('../logger/logger');
const log = new Logger('KYC-Screening-Dao');
const mongoose = require('mongoose');
const GovernmentCountry = require('./kyc-screening-schema-model').GovernmentCountry;
const IncorporationCountry = require('./kyc-screening-schema-model').IncorporationCountry;
const NationalityCountry = require('./kyc-screening-schema-model').NationalityCountry;
const OperationCountry = require('./kyc-screening-schema-model').OperationCountry;
const ResidenceCountry = require('./kyc-screening-schema-model').ResidenceCountry;
const LegalStructure = require('./kyc-screening-schema-model').LegalStructure;
const Application = require('./kyc-screening-schema-model').Application;
const Decision = require('./kyc-screening-schema-model').Decision;
const fs = require('fs');
const fileUtils = require('../utils/file-utils');
const web3Storage = require('../scripts/push-to-blockchain');
const web3Utils = require('../utils/web3-utils');
const axios = require('axios');
const ocrUtils = require('../utils/ocr-utils');
const download = require('download');

const dbUrl = process.env.MONGODB_KSS_URL;
const sanctionsUrl = process.env.OPEN_SANCTIONS_BASE_URL;

// Connect to KYC Screening Service (KSS) Database
mongoose.connect(dbUrl)
        .then(log.info('connected to mongo kss database....'))
        .catch(err => log.error('unable to connect, please check your connection....' + err));

function getCurrentDateTime() {
  return new Date().toUTCString();
}

function generateDecisionId() {
  let uuid = Math.floor(new Date().valueOf() * Math.random());
  let decisionId = 'D' + uuid.toString().slice(-8);
  return decisionId;
}

const createNewApplicationRecord = async (applicationObj, res) => {
  let newApplication = new Application({
    application_id: applicationObj.applicationId,
    company_id: applicationObj.companyId,
    application_details: applicationObj.applicationDetails,
    poi_extracted: [],
    poa_extracted: [],
    risk_score: null,
    comments: '',
    decision: '',
    shared: false,
    decision_cids: [],
    closed_date: null
  });

  // Save application to kss mongodb
  try {
    const result = await newApplication.save();
    log.info(`Application ${result.application_id} has been created for company ${result.company_id}`);

    return res.send({
      messageCode: 'CREAPP',
      message: `Application ${result.application_id} has been successfully created.`
    });
  } catch (err) {
    log.error(`Error in creating new application for company ${applicationObj.companyId}: ` + err);
      return res.status(400).send({
        messageCode: 'CREAPPERR',
        message: 'Unable to create new application for customer ' + applicationObj.companyId
      });
  }
}

const getIncorporationCountries = async (res) => {
  return await IncorporationCountry.find({})
    .then(countries => {
      return res.send({
        messageCode: `INCCOU`,
        message: `Successful retrieval of countries of incorportation`,
        result: countries
      });
    })
    .catch(error => {
      log.error(`Error retrieving countries of incorportation: ${error}`)
      return res.status(400).send({
        messageCode: 'INCCOUERR',
        message: 'Failed to retrieve countries of incorportation'
      });
    });
}

// DAO - get application by company ID (username)
const getApplication = async (companyId, res) => {
  try {
    const result =  await Application.findOne({ company_id: companyId });
    log.info(`Application ${result.application_id} has been retrieved for company ${result.company_id}`);
    
    return res.send({
      messageCode: 'GETAPP',
      message: 'Application has been retrieved successfully.',
      applicationDetails: result
    });
  } catch (err) {
    log.error(`Error retrieving application for company ${companyId}: ` + err);
    
    return res.status(400).send({
      messageCode: 'GETAPPERR',
      message: 'Unable to retrieve application for company ' + companyId
    });
  }
}

const getOperationCountries = async (res) => {
  return await OperationCountry.find({})
    .then(countries => {
      return res.send({
        messageCode: `OPECOU`,
        message: `Successful retrieval of countries of operation`,
        result: countries
      });
    })
    .catch(error => {
      log.error(`Error retrieving countries of operation: ${error}`)
      return res.status(400).send({
        messageCode: 'OPECOUERR',
        message: 'Failed to retrieve countries of operation'
      });
    });
}

const getNationalityCountries = async (res) => {
  return await NationalityCountry.find({})
    .then(countries => {
      return res.send({
        messageCode: `NATCOU`,
        message: `Successful retrieval of countries of nationality`,
        result: countries
      });
    })
    .catch(error => {
      log.error(`Error retrieving countries of nationality: ${error}`)
      return res.status(400).send({
        messageCode: 'NATCOUERR',
        message: 'Failed to retrieve countries of nationality'
      });
    });
}

const getResidenceCountries = async (res) => {
  return await ResidenceCountry.find({})
    .then(countries => {
      return res.send({
        messageCode: `RESCOU`,
        message: `Successful retrieval of countries of residence`,
        result: countries
      });
    })
    .catch(error => {
      log.error(`Error retrieving countries of residence: ${error}`)
      return res.status(400).send({
        messageCode: 'RESCOUERR',
        message: 'Failed to retrieve countries of residence'
      });
    });
}

const getGovernmentCountries = async (res) => {
  return await GovernmentCountry.find({})
    .then(countries => {
      return res.send({
        messageCode: `GOVCOU`,
        message: `Successful retrieval of countries of government`,
        result: countries
      });
    })
    .catch(error => {
      log.error(`Error retrieving countries of government: ${error}`)
      return res.status(400).send({
        messageCode: 'GOVCOUERR',
        message: 'Failed to retrieve countries of government'
      });
    });
}

const getLegalStructures = async (res) => {
  return await LegalStructure.find({})
    .then(structure => {
      return res.send({
        messageCode: `RESLEG`,
        message: `Successful retrieval of legal structures`,
        result: structure
      });
    })
    .catch(error => {
      log.error(`Error retrieving legal structures: ${error}`)
      return res.status(400).send({
        messageCode: 'RESLEGERR',
        message: 'Failed to retrieve legal structures'
      });
    });
}

const individualSanctionScreening = async (personObj, res) => {
  const firstName = personObj.firstName
  const lastName = personObj.lastName
  const individualSanctionsUrl = sanctionsUrl + firstName + lastName;

  axios.get(individualSanctionsUrl)
    .then(result => {
      console.log(`individual sanction status code: [${result.status}] ${result.statusText}`);
      return res.send({
        messageCode: `INDRSK`,
        message: `Successful retrieval of sanctions for ${firstName} ${lastName}`,
        data: result.data
      });
    })
    .catch(error => {
      log.error(`Error retrieving individual sanction result: ${error}`)
      return res.status(400).send({
        messageCode: 'INDRSKERR',
        message: 'Failed to retrieve individual sanction'
      });
    })
}

const businessSanctionScreening = async (companyName, res) => {
  const businessSanctionsUrl = sanctionsUrl + companyName;

  axios.get(businessSanctionsUrl)
    .then(result => {
      console.log(`business sanction status code: [${result.status}] ${result.statusText}`);
      return res.send({
        messageCode: `INDRSK`,
        message: `Successful retrieval of sanctions for ${companyName}`,
        data: result.data
      });
    })
    .catch(error => {
      log.error(`Error retrieving business sanction: ${error}`)
      return res.status(400).send({
        messageCode: 'INDRSKERR',
        message: 'Failed to retrieve business sanction result'
      });
    })
}

// Extract POI Information from Picture using AI OCR
const extractIdentityInformation = async (appObj, res) => {
  try {
    const result = await Application.findOne({ application_id: appObj.applicationId  });
    const cids = result.application_details[0].application_cids;
    const currentCid = cids[cids.length - 1]
    const filename = result.application_details[0].documents[0].poi.file_name;
    const url = `https://gateway.ipfs.io/ipfs/${currentCid}/${result.application_id}/${filename}`;
    // test url - const url = 'https://gateway.ipfs.io/ipfs/bafybeicnub6avzilytjv2dbvoq2hshu4jl22rta3pwo37oiebu7qncms7i/K51663099/D69798756_ID.jpeg'
    const poiFilePath = `./uploads/application/poi/${appObj.applicationId}/`;

    const pathExists = fs.existsSync(poiFilePath);
    if (!pathExists) {
      fs.mkdirSync(poiFilePath, { recursive: true });
    }

    const poiFileDest = poiFilePath + filename
    fs.writeFileSync(poiFileDest, await download(url));
    const filePaths = [poiFileDest];

    let docObj = {
      kycType: 'poi',
      documentType: appObj.documentType
    }
    const extractionResults = await ocrUtils.butlerOcrExtraction(filePaths, docObj);

    return res.send({
      messageCode: `EXTPOI`,
      message: `Successful extraction of poi information for ${appObj.applicationId}`,
      data: extractionResults
    });
  }
  catch (err) {
    log.error(`Error extracting poi information: ${err}`)
    return res.status(400).send({
      messageCode: 'EXTPOIERR',
      message: 'Failed to extract poi information'
    });
  }
}

// Extract POA Information from Document using AI OCR
const extractAddressInformation = async (appObj, res) => {
  try {
    const result = await Application.findOne({ application_id: appObj.applicationId  });
    const cids = result.application_details[0].application_cids;
    const currentCid = cids[cids.length - 1]
    const filename = result.application_details[0].documents[0].poa.file_name;
    const url = `https://gateway.ipfs.io/ipfs/${currentCid}/${result.application_id}/${filename}`;

    const poaFilePath = `./uploads/application/poa/${appObj.applicationId}/`;

    const pathExists = fs.existsSync(poaFilePath);
    if (!pathExists) {
      fs.mkdirSync(poaFilePath, { recursive: true });
    }

    const poaFileDest = poaFilePath + filename
    fs.writeFileSync(poaFileDest, await download(url));
    const filePaths = [poaFileDest];

    let docObj = {
      kycType: 'poa',
      documentType: appObj.documentType
    }
    const extractionResults = await ocrUtils.butlerOcrExtraction(filePaths, docObj);

    return res.send({
      messageCode: `EXTPOA`,
      message: `Successful extraction of poa information for ${appObj.applicationId}`,
      data: extractionResults
    });
  }
  catch (err) {
    log.error(`Error extracting poa information: ${err}`)
    return res.status(400).send({
      messageCode: 'EXTPOAERR',
      message: 'Failed to extract poa information'
    });
  }

}

// Save POI Extraction Details
const updateApplicationPoiExtraction = async (appObj, res) => {
  try {
    const result = await Application.findOneAndUpdate({ application_id: appObj.applicationId }, 
      { $set: { poi_extracted: appObj.poiExtracted } });
    log.info(`Application ${result.application_id} poi extraction has been updated`);

    return res.send({
      messageCode: 'UPDAPPPOI',
      message: 'Updated poi extraction for application ' + result.application_id
    });
  } catch (err) {
    log.error(`Error updating poi extraction for application ${appObj.applicationId}: ` + err);
    
    return res.status(400).send({
      messageCode: 'UPDAPPPOIERR',
      message: 'Unable to update application poi extraction' + appObj.applicationId
    });
  }
}

// Save POA Extraction Details
const updateApplicationPoaExtraction = async (appObj, res) => {
  try {
    const result = await Application.findOneAndUpdate({ application_id: appObj.applicationId }, 
      { $set: { poa_extracted: appObj.poaExtracted } });
    log.info(`Application ${result.application_id} poa extraction has been updated`);

    return res.send({
      messageCode: 'UPDAPPPOA',
      message: 'Updated poa extraction for application ' + result.application_id
    });
  } catch (err) {
    log.error(`Error updating poa extraction for application ${appObj.applicationId}: ` + err);
    
    return res.status(400).send({
      messageCode: 'UPDAPPPOAERR',
      message: 'Unable to update application poa extraction' + appObj.applicationId
    });
  }
}

// Update risk score
const updateApplicationRiskScore = async (appObj, res) => {
  try {
    const result = await Application.findOneAndUpdate({ application_id: appObj.applicationId }, 
      { $set: { risk_score: appObj.riskScore } });
    log.info(`Application ${result.application_id} risk score has been updated`);

    return res.send({
      messageCode: 'UPDAPPRIS',
      message: 'Updated risk score for application ' + result.application_id
    });
  } catch (err) {
    log.error(`Error updating risk score for application ${appObj.applicationId}: ` + err);
    
    return res.status(400).send({
      messageCode: 'UPDAPPRISERR',
      message: 'Unable to update application risk score' + appObj.applicationId
    });
  }
}

// Save Application Decision and Comments
const updateApplicationDecisionComments = async (appObj, res) => {
  let date = getCurrentDateTime();

  try {
    const result = await Application.findOneAndUpdate({ application_id: appObj.applicationId }, 
      { $set: { decision: appObj.decision, comments: appObj.comments, closed_date: date } });
    log.info(`Application ${result.application_id} decision, comments, closed date have been updated`);

    return res.send({
      messageCode: 'UPDAPPDEC',
      message: 'Updated details for application ' + result.application_id
    });
  } catch (err) {
    log.error(`Error updating details for application ${appObj.applicationId}: ` + err);
    
    return res.status(400).send({
      messageCode: 'UPDAPPDECERR',
      message: 'Unable to update application details' + appObj.applicationId
    });
  }
}

// Share Application Decision on Blockchain
const shareApplicationDecision = async (applicationId, res) => {
  let date = getCurrentDateTime();
  let decisionId = generateDecisionId();

  try {
    const result = await Application.findOne({ application_id: applicationId });
    const fileObject = [{
      application_id: result.application_id,
      risk_score: result.risk_score,
      decision: result.decision
    }]
    // Create json file for file object
    fileUtils.createApplicationDecisionFileObject(applicationId, fileObject);

    // Push application decision file to blockchain
    const dirPath = `./uploads/application/decisions/${applicationId}.json`;
    web3Storage.pushFilesToBlockchain(dirPath);
    const cid = web3Utils.applicationCID.getCID();

    // Save cid to mongodb for later retrieval
    await Application.findOneAndUpdate(
      { application_id: applicationId }, 
      { $push: { decision_cids: cid }},
      { $set: { shared: true } }
    );

    let newDecision = new Decision({
      decision_id: decisionId,
      application_id: applicationObj.applicationId,
      decision_cid: applicationObj.companyId,
      shared_date: date
    });

    const decisionResult = await newDecision.save();
    log.info(`Decision ${decisionResult.decision_id} has been created.`);

    // After pushing to blockchain remove files from local storage
    fs.unlinkSync(dirPath, (err) => {
      if (err) {
        log.error(`Error removing directory ${dirPath}: `, err);
      }
      log.info(`Removal of files at ${dirPath} successful!`);
    })
    
    return res.send({
      messageCode: 'SUBDEC',
      message: 'Application decision has been shared on blockchain successfully.'
    });
  } catch (err) {
    log.error(`Error sharing decision for ${applicationId}: ` + err);
    
    return res.status(400).send({
      messageCode: 'SUBDECERR',
      message: 'Unable to share decision for ' + applicationId
    });
  }
}

const getSubmittedApplicationDetails = async (companyId, res) => {
  try {
    const result = await Application.findOne({ company_id: companyId  });
    const cids = result.application_details[0].application_cids;
    const currentCid = cids[cids.length - 1]
    const url = `https://gateway.ipfs.io/ipfs/${currentCid}/${result.application_id}/${result.application_id}.json`;
    axios
        .get(url)
        .then(result => {
          console.log(`status code: ${result.status} ${result.statusText}`);
          console.log(result.data)
          return res.send({
            messageCode: `SUBAPPDET`,
            message: `Successful retrieval of application details from web3 storage`,
            data: result.data
          })
        })
        .catch(error => {
          log.error('Eror retrieving application details from web3 storage: ', error);
        })
  } catch (err) {
    log.error(`Error in retrieving application details: ` + err);
    
    return res.status(400).send({
      messageCode: 'SUBAPPDETERR',
      message: 'Failed to retrieve application from blockchain service'
    });
  }
}

const getSubmittedPoiFile = async (companyId, res) => {
  try {
    const result = await Application.findOne({ company_id: companyId  });
    const cids = result.application_details[0].application_cids;
    const currentCid = cids[cids.length - 1]
    const filename = result.application_details[0].documents[0].poi.file_name;
    const url = `https://gateway.ipfs.io/ipfs/${currentCid}/${result.application_id}/${filename}`;
    return res.send({
      messageCode: `SUBAPPPOI`,
      message: `Successful retrieval of application poi file link`,
      poiLink: url
    })
  } catch (err) {
    log.error(`Error in retrieving application poi file: ` + err);
    
    return res.status(400).send({
      messageCode: 'SUBAPPPOIERR',
      message: 'Failed to retrieve application poi file link'
    });
  }
}

const getSubmittedPoaFile = async (companyId, res) => {
  try {
    const result = await Application.findOne({ company_id: companyId  });
    const cids = result.application_details[0].application_cids;
    const currentCid = cids[cids.length - 1]
    const filename = result.application_details[0].documents[0].poa.file_name;
    const url = `https://gateway.ipfs.io/ipfs/${currentCid}/${result.application_id}/${filename}`;
    return res.send({
      messageCode: `SUBAPPPOA`,
      message: `Successful retrieval of application poa file link`,
      poaLink: url
    })
  } catch (err) {
    log.error(`Error in retrieving application poa file: ` + err);
    
    return res.status(400).send({
      messageCode: 'SUBAPPPOAERR',
      message: 'Failed to retrieve application poa file link'
    });
  }
}

module.exports = {
  createNewApplicationRecord,
  getApplication,
  getIncorporationCountries,
  getOperationCountries,
  getNationalityCountries,
  getResidenceCountries,
  getGovernmentCountries,
  getLegalStructures,
  individualSanctionScreening,
  businessSanctionScreening,
  extractIdentityInformation,
  extractAddressInformation,
  updateApplicationDecisionComments,
  updateApplicationPoiExtraction,
  updateApplicationPoaExtraction,
  updateApplicationRiskScore,
  shareApplicationDecision,
  getSubmittedApplicationDetails,
  getSubmittedPoiFile,
  getSubmittedPoaFile
}