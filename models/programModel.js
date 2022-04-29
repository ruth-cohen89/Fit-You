const mongoose = require('mongoose');
//const validator = require('validator');

// we need programSchema to vestigate i=on the mealSchema o
// otherwise the user may create as many times dailyMealPlans with different macros
// we need to keep the macros here since it is constant, and not changing by day...
// we cant store all of this data in the user since it is not relevant to the user itself
// wont be modular, (completeDate is not relevant to the user password and name)
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
  //we have to keep it for the user, the program can be changed only by admin
  completeDate: Date,
  caloriesPerDay: {
    type: Number,
    required: [true, 'How many calories should you eat every day?'],
  },
  proteinPerDay: {
    type: Number,
    required: [true, 'How many calories should you eat every day?'],
  },
  carbsPerDay: Number,
  fatPerDay: Number,
  fiberPerDay: Number,
  dailyMealPlans: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'MealPlan',
    },
  ],
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
