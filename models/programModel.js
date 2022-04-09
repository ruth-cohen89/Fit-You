const mongoose = require('mongoose');
const validator = require('validator');

const programSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mass', 'recomposition', 'losingFat'],
    required: [true, 'Please choose type of program!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Program must belong to a user'],
  },
  completeDate: Date,
  caloriesPerDay: Number,
  proteinPerDay: Number,
  fatPerDay: Number,
  CrabsPerDay: Number,
  meals: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Meal',
      required: [true, 'Program must contain some meals!'],
    },
  ],
  workouts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Workout',
      required: [true, 'Program must contain some workouts!'],
    },
  ],
});

const Program = mongoose.model('Program', programSchema);
module.exports = Program;
