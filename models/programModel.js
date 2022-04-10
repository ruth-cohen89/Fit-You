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
    unique: true,
    required: [true, 'Program must belong to a user'],
  },
  completeDate: Date,
  caloriesPerDay: {
    type: Number,
    required: [true, 'How many calories should you eat every day?'],
  },
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
  numberOfWorkouts: {
    type: Number,
    minLength: 2,
    required: [true, 'Get your body moving, buddy!'],
  },
  workouts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Workout',
      required: [true, 'Program must contain some workouts!'],
    },
  ],
});

programSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'meals',
    select: '-__v',
  });
  next();
});

programSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'workouts',
    select: '-__v',
  });
  next();
});

const Program = mongoose.model('Program', programSchema);
module.exports = Program;
