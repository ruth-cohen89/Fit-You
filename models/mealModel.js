const mongoose = require('mongoose');
const slugify = require('slugify');

const mealSchema = new mongoose.Schema({
  dailyMealPlan: {
    type: mongoose.Schema.ObjectId,
    ref: 'dailyMealPlan',
  },
  name: {
    type: String,
    required: [true, 'Please provide name of meal.'],
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
  },
  slug: String,

  // calculating macros for the meal at creation
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
  foods: [
    {
      type: mongoose.Schema.ObjectId,
      required: [true, 'What foods would you like to eat?'],
    },
  ],
});

mealSchema.pre('save', function (req, res, next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

mealSchema.pre(/^find/, function (next) {
  this.populate({
    select: '-__v',
  });
  next();
});
// mealSchema.pre('save', function (req, next) {
//   this.calories = req.body.calories * req.body.numOfServings;
//   next();
// });

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;
