const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const CourseSchema = new mongoose.Schema({
  course_id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  modality: {
    type: String,
    default: '-'
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  hours: {
    type: Number,
    default: 0
  },
  state: {
    type: String,
    default: 'available'
  }
});

CourseSchema.plugin(timestamp);

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
