/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const Food = require('./foodModel');
const Recipe = require('./recipeModel');
const Program = require('./programModel');

const mealSchema = new mongoose.Schema({
  program: {
    type: mongoose.Schema.ObjectId,
    ref: 'programSchema',
  },
  date: {
    type: Date,
    required: [true, 'when will you eat this meal?'],
  },
  type: {
    type: String,
    required: [
      true,
      'Please provide type of meal. (breakfast/lunch/dinner/snack)',
    ],
  },
  totalNutrients: {
    calories: {
      type: Number,
      required: [true, 'What are the total calories of the meal?'],
    },
    protein: {
      type: Number,
      required: [true, 'what is the total fat of the meal?'],
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
        measure: {
          type: String,
          default: 'gram',
          required: [true, 'Provide item measure.'],
        },
        amount: {
          type: Number,
          required: [true, 'How many servings of this item?'],
        },
      },
    },
  ],
});

const isEnoughCalories = async function () {
  const dailyCalories = Program.find({ id: this.program }).caloriesPerDay;

  const dailyMeals = await Meal.find({
    program: this.program,
    date: this.date,
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
  //const itemIds = this.items.map((f) => f.itemId);
  //const itemObjects = [];
  //itemObjects.push(await Food.find({ _id: { $in: itemIds } }));
  //itemObjects.push(await Recipe.find({ _id: { $in: itemIds } }));

  await isEnoughCalories.call(this);
  next();
});

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;
