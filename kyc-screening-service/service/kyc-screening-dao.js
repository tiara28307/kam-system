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
const fs = require('fs');
const fileUtils = require('../utils/file-utils');
const web3Storage = require('../scripts/push-to-blockchain');
const web3Utils = require('../utils/web3-utils');
const axios = require('axios');

const dbUrl = process.env.MONGODB_KSS_URL;
const sanctionsUrl = process.env.OPEN_SANCTIONS_BASE_URL;

// Connect to KYC Screening Service (KSS) Database
mongoose.connect(dbUrl)
        .then(log.info('connected to mongo kss database....'))
        .catch(err => log.error('unable to connect, please check your connection....' + err));

function getCurrentDateTime() {
  return new Date().toUTCString();
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
    .then(legalStructures => {
      return res.send({
        messageCode: `RESCOU`,
        message: `Successful retrieval of legal structures`,
        result: legalStructures
      });
    })
    .catch(error => {
      log.error(`Error retrieving legal structures: ${error}`)
      return res.status(400).send({
        messageCode: 'RESCOUERR',
        message: 'Failed to retrieve legal structures'
      });
    });
}

const individualSanctionScreening = async (req, res) => {
  const individualData = req.body;
  const firstName = 'Barrack';
  const lastName = 'Obama';
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

const businessSanctionScreening = async (req, res) => {
  const businessData = req.body;
  const companyName = 'Daytona Pools, INC'
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
const extractIdentityInformation = async (applicationId, res) => {

  const result = await Application.findOne({ application_id: applicationId  });
  const cids = result.application_details[0].application_cids;
  const currentCid = cids[cids.length - 1]
  const filename = result.application_details[0].documents[0].poi.file_name;
  const url = `https://gateway.ipfs.io/ipfs/${currentCid}/${result.application_id}/${filename}`;

  const filePaths = [url];
  

  

}

// Extract POA Information from Document using AI OCR
const extractAddressInformation = async (req, res) => {

}

// Save Application Decision and Comments

// Share Application Decision on Blockchain

module.exports = {
  createNewApplicationRecord,
  getIncorporationCountries,
  getOperationCountries,
  getNationalityCountries,
  getResidenceCountries,
  getGovernmentCountries,
  getLegalStructures,
  individualSanctionScreening,
  businessSanctionScreening
}