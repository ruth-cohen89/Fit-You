const mongoose = require('mongoose');
const validator = require('validator');

const mealPlanSchema = new mongoose.Schema({
  calories: {
    type: Number,
    required: [true, 'Please provide amount of calories per day.'],
  },
  protein: {
    type: Number,
    required: [true, 'Please provide amount of protein per day.'],
  },
  carbs: Number,
  fat: Number,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Program must belong to a user'],
    unique: true,
  },
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  meals: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Meal',
    },
  ],
});

const MealPlan = mongoose.model('Meal', mealPlanSchema);
module.exports = MealPlan;
