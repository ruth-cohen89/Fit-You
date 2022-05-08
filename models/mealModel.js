/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const Program = require('./programModel');

// we have ref to program in both meals and workouts
// and not the opposite, since meals and workouts
// are always updated and program remains the same usually
const mealSchema = new mongoose.Schema({
  program: {
    type: mongoose.Schema.ObjectId,
    ref: 'programSchema',
    required: [true, 'Please provide program id'],
  },
  day: {
    type: String,
    required: [true, 'Choose a day.'],
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
  type: {
    type: String,
    required: [
      true,
      'Please provide type of meal. (breakfast/lunch/brunch/dinner/snack)',
    ],
    enum: ['breakfast', 'lunch', 'brunch', 'dinner', 'snack'],
  },
  totalNutrients: {
    calories: {
      type: Number,
      required: [true, 'Insert amount of calories for the meal.'],
    },
    protein: {
      type: Number,
      required: [true, 'Insert amount of protein for the meal.'],
    },
    fat: Number,
    carbs: Number,
  },
  items: [
    {
      _id: false,
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'itemType',
        required: true,
      },
      itemType: {
        type: String,
        required: [true, 'Choose between Food and Recipe'],
        enum: ['Food', 'Recipe'],
      },
      servingSize: {
        type: {
          type: String,
          default: 'gram',
          required: [true, 'Provide type of measure.'],
        },
        amount: {
          type: Number,
          required: [true, 'Provide amount of serving.?'],
        },
        //grams: Number,
      },
    },
  ],
});

const isEnoughCalories = async function () {
  const dailyCalories = Program.find({ id: this.program }).caloriesPerDay;

  const dailyMeals = await Meal.find({
    program: this.program,
    day: this.day,
  });
  if (dailyMeals) {
    const calories = dailyMeals.map((m) => m.totalNutrients.calories);
    if (calories + this.totalNutrients.calories > dailyCalories) {
      console.error(
        'Too many calories for that day, please change one of the meals'
      );
    }
  }
};

mealSchema.pre('save', async function (next) {
  await isEnoughCalories.call(this);
  next();
});

mealSchema.pre(/^find/, function (next) {
  console.log('hyush')
  this.populate({
    path: 'items.itemId',
    model: 'Food',
    select: '-__v',
  });
  next();
});
mealSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items.itemId',
    model: 'Recipe',
    select: '-__v',
  });
  next();
});

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;
