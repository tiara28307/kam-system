const Logger = require('../../logger/logger');
const log = new Logger('Register-Dao');
const mongoose = require('mongoose');
const CompanyType = require('./register-schema-model').CompanyType;
const Country = require('./register-schema-model').Country;

const dbUrl = process.env.MONGODB_KAM_URL;

mongoose.connect(dbUrl)
        .then(log.info('connected to mongo kam database....'))
        .catch(err => log.error('unable to connect, please check your connection....' + err));

const getAllCompanyTypes = async (res) => {
  var companyTypesMap = [];
  return await CompanyType.find({})
    .then(types => {
      types.forEach(type => {
        companyTypesMap.push({
          code: type.code,
          name: type.name
        });
      });
      return res.send({ companyTypesMap });
    })
    .catch(err => {
      throw new Error(err);
    });
}

const getAllCountries = async (res) => {
  var countriesMap = [];
  return await Country.find({})
    .then(countries => {
      countries.forEach(country => {
        countriesMap.push({
          code: country.Code,
          name: country.Name
        });
      });
      return res.send({ countriesMap });
    })
    .catch(err => {
      throw new Error(err);
    })
}

module.exports = {
    getAllCompanyTypes,
    getAllCountries
}