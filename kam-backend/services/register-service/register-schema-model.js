const mongoose = require('mongoose');
    
// Company Type Modal Schema
const companyTypeSchema = new mongoose.Schema({
    code: Number,
    name: String
}, {
  collection: 'companyTypes'
});
    
// Country Modal Schema
const countrySchema = new mongoose.Schema({
    Name: String,
    Code: String
}, {
  collection: 'countries'
});

const CompanyType = mongoose.model('Company Type', companyTypeSchema);
const Country = mongoose.model('Country', countrySchema);

module.exports = {
    CompanyType,
    Country
}