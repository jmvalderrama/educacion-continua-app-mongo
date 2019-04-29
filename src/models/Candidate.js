const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const CandidateSchema = new mongoose.Schema({
  candidate_id: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: Number,
    required: true,
    trim: true
  },
  courses_ids: {
    type: [Number],
    default: []
  }
});

CandidateSchema.plugin(timestamp);

const Candidate = mongoose.model('Candidate', CandidateSchema);

module.exports = Candidate;
