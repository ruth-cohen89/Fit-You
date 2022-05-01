/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const Food = require('./foodModel');

const exerciseSchema = new mongoose.Schema({
  exercisePlan: {
    type: mongoose.Schema.ObjectId,
    ref: 'exercisePlan',
  },

  type: {
    type: String,
    required: [true, 'Please provide type of exercise.'],
    enum: ['aerobic', 'liftingWeights', 'bodyWeight'],
  },
  calorieBurn: Number,
  totalDuration: Number,
});

const Exercise = mongoose.model('exercise', exerciseSchema);
module.exports = Exercise;
