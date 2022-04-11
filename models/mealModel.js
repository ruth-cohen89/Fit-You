const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name of meal.'],
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
  },
  slug: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  numOfServings: {
    default: 1,
  },
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

  // foodIds
  foods: {
    type: mongoose.Schema.ObjectId,
    ref: 'Food',
    required: [true, 'What do you want to eat?'],
    minLength: 1,
  },
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
  hour: Number,
});

mealSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// mealSchema.pre('save', function (req, next) {
//   this.calories = req.body.calories * req.body.numOfServings;
//   next();
// });

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;
