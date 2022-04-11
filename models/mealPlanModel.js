const mongoose = require('mongoose');
const validator = require('validator');

// Daily meal plan, every day different plan
const mealPlanSchema = new mongoose.Schema({
  //per day
  calories: {
    type: Number,
    required: [true, 'Please provide amount of calories per day.'],
  },
  protein: {
    type: Number,
  },
  carbs: Number,
  fat: Number,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Meal plan must belong to a user'],
    unique: true,
  },
  meals: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Meal',
    },
  ],
  dayOfWeek: {
    type: String,
    required: [true, 'Which day are you willing to eat this meal?.'],
    enum: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wedensday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
  },
});

const MealPlan = mongoose.model('Meal', mealPlanSchema);
module.exports = MealPlan;
