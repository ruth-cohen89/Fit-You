const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name of exercise.'],
  },
  type: {
    type: String,
    required: [true, 'Please provide type of exercise.'],
    enum: ['cardio', 'bodyWeight', 'weightLifting'],
  },
  // If on YouTube
  url: String,
});

const exercisePlan = mongoose.model('exercise', exerciseSchema);
module.exports = exercisePlan;
