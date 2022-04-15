const mongoose = require('mongoose');
//const validator = require('validator');

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

  // optional?
  caloriesPerDay: {
    type: Number,
    required: [true, 'How many calories should you eat every day?'],
  },
  mealPlan: {
    type: mongoose.Schema.ObjectId,
    ref: 'MealPlan',
  },
  // workoutPlan: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'WorkoutPlan',
  // },
  // numberOfWorkouts: {
  //   type: Number,
  //   minLength: 2,
  //   required: [true, 'Get your body moving, buddy!'],
  // },
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
