const mongoose = require('mongoose');

const GovernmentCountrySchema = new mongoose.Schema({
  "Country of Government": String,
  "Risk Level for Country of Government": String,
  Score: Number
}, {
  collection: 'countryGovernment'
});

const IncorporationCountrySchema = new mongoose.Schema({
  "Country of Incorporation": String,
  "Risk Level for Country of Incorporation": String,
  Score: Number
}, {
  collection: 'countryIncorporation'
});

const NationalityCountrySchema = new mongoose.Schema({
  "Country of Nationality": String,
  "Risk Level for Country of Nationality": String,
  Score: Number
}, {
  collection: 'countryNationality'
});

const OperationCountrySchema = new mongoose.Schema({
  "Country of Operation": String,
  "Risk Level for Country of Operation": String,
  Score: Number
}, {
  collection: 'countryOperation'
});

const ResidenceCountrySchema = new mongoose.Schema({
  "Country of Residence": String,
  "Risk Level for Country of Residence": String,
  Score: Number
}, {
  collection: 'countryResidence'
});

const LegalStructureSchema = new mongoose.Schema({
  "Legal structure": String,
  "Risk_legal_structure": String,
  Score: Number
}, {
  collection: 'legalStructure'
})

// Customer Application Modal Schema
const ApplicationSchema = new mongoose.Schema({
  application_id: {
    type: String,
    match: [/^(\w{9})$/, 'Application ID must be 9 chars'],
    unique: true,
    required: true
  },
  company_id: {
    type: String,
    match: [/^(\w{13})$/, 'Company ID must be 13 chars'],
    unique: true,
    required: true
  },
  application_details: {
    type: Array,
    required: true
  },
  poi_extracted: Array,
  poa_extracted: Array,
  risk_score: Number,
  comments: {
    type: String
  },
  decision: {
    type: String
  },
  shared: {
    type: Boolean,
    required: true
  },
  decision_cids: Array,
  closed_date: Date
}, {
collection: 'applications'
});

const DecisionSchema = new mongoose.Schema({
  decision_id: {
    type: String,
    match: [/^(\w{9})$/, 'Decision ID must be 9 chars'],
    unique: true,
    required: true
  },
  application_id: {
    type: String,
    match: [/^(\w{9})$/, 'Application ID must be 9 chars'],
    unique: true,
    required: true
  },
  decision_cid: String,
  shared_date: Date
}, {
  collection: 'decisions'
});

const GovernmentCountry = mongoose.model('Countries of Government', GovernmentCountrySchema);
const IncorporationCountry = mongoose.model('Countries of Incorporation', IncorporationCountrySchema);
const NationalityCountry = mongoose.model('Countries of Nationality', NationalityCountrySchema);
const OperationCountry = mongoose.model('Countries of Operation', OperationCountrySchema);
const ResidenceCountry = mongoose.model('Countries of Residence', ResidenceCountrySchema);
const LegalStructure = mongoose.model('Legal Structure', LegalStructureSchema);
const Application = mongoose.model('Application under Review', ApplicationSchema);
const Decision = mongoose.model('Application Decision', DecisionSchema);

module.exports = {
  GovernmentCountry,
    IncorporationCountry,
    NationalityCountry,
    OperationCountry,
    ResidenceCountry,
    LegalStructure,
    Application,
    Decision
}