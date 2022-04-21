const mongoose = require('mongoose');
//const validator = require('validator');
const slugify = require('slugify');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name of meal.'],
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
  },
  slug: String,
  dailyMealPlan: {
    type: mongoose.Schema.ObjectId,
    ref: 'dailyMealPlan',
  },
  // calculating macros for the meal at creation
  calories: {
    type: Number,
    required: [true, 'Please provide amount of calories .'],
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
      type: String,
      required: [true, 'What foods would you like to eat?'],
    },
  ],
  //type: mongoose.Schema.ObjectId,
  //ref: 'Food',
  //required: [true, 'What foods would you like to eat in this meal? :)'],
  minLength: 1,
});

mealSchema.pre('save', function (next) {
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
