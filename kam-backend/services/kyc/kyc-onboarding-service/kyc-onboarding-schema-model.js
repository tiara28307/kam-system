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

const PepType = mongoose.model('PEP Type', PepTypeSchema);

module.exports = {
    PepType
}