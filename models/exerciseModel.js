/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const Food = require('./foodModel');

const excerciseSchema = new mongoose.Schema({
  dailyExcercisePlan: {
    type: mongoose.Schema.ObjectId,
    ref: 'dailyExcercisePlan',
  },

  type: {
    type: String,
    required: [true, 'Please provide type of excercise.'],
    enum: ['aerobic', 'liftingWeights', 'bodyWeight'],
  },
  calorieBurn: Number,
  duration: Number,
});

const Excercise = mongoose.model('excercise', excerciseSchema);
module.exports = Excercise;
