const mongoose = require('mongoose');
    
// Request Modal Schema
const RequestSchema = new mongoose.Schema({
  request_id: {
    type: String,
    match: [/^(\w{9})$/, 'Request ID must be 9 chars'],
    unique: true,
    required: true
  },
  applicant_email: {
    type: String,
    required: true
  },
  company_name: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  job_title: {
    type: String,
    required: true
  },
  sender_email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  request_date: {
    type: Date,
    required: true
  },
  application_id: String,
  app_cid: String
}, {
  collection: 'requests'
});

const Request = mongoose.model('Request', RequestSchema);

module.exports = {
    Request
}
