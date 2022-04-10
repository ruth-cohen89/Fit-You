const mongoose = require('mongoose');
const validator = require('validator');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name of meal.'],
    unique: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    //required: [true, 'Meal must belong to a program'],
  },
  dayOfWeek: String,
  //required: [true, 'Which day are you going to eat this meal?'],

  hour: Number,
  calories: {
    type: Number,
    required: [true, 'Please provide amount of calories.'],
  },
  protein: {
    type: Number,
    required: [true, 'Please provide amount of protein.'],
  },
  fat: Number,
  carbs: Number,
});

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;
