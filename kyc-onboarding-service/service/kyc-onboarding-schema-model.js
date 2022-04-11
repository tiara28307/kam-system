const mongoose = require('mongoose');
    
// PEP Type Modal Schema
const PepTypeSchema = new mongoose.Schema({
    code: Number,
    name: String,
    risk_level: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW', 'NONE'],
      uppercase: true
    }
}, {
  collection: 'pepTypes'
});

// Customer Application Modal Schema
const ApplicationSchema = new mongoose.Schema({
  application_id: {
    type: String,
    match: [/^(\w{9})$/, 'Application ID must be 9 chars'],
    unique: true,
    required: true
  },
  customer_id: {
    type: String,
    match: [/^(\w{13})$/, 'Customer ID must be 13 chars'],
    unique: true,
    required: true
  },
  application_cids: {
    type: Array
  },
  creation_date: {
    type: Date,
    required: true
  },
  last_modified: {
    type: Date,
    required: true
  },
  application_type: {
    type: String,
    required: true
  },
  details: {
    type: Array,
    required: true
  },
  submitted: {
    type: Boolean,
    required: true
  },
  submission_date: {
    type: Date
  }
}, {
collection: 'applications'
});

const PepType = mongoose.model('PEP Type', PepTypeSchema);
const Application = mongoose.model('Application', ApplicationSchema);

module.exports = {
    PepType,
    Application
}