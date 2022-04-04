const Logger = require('../logger/logger');
const log = new Logger('KYC-Onboarding-Dao');
const mongoose = require('mongoose');
const PepType = require('./kyc-onboarding-schema-model').PepType;

const dbUrl = process.env.MONGODB_KOS_URL;

mongoose.connect(dbUrl)
        .then(log.info('connected to mongo kos database....'))
        .catch(err => log.error('unable to connect, please check your connection....' + err));

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

module.exports = {
    getAllPepTypes
}