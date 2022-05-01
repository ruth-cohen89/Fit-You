/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const Food = require('./foodModel');

// since meals in mealPlans are updated all the time,
// I keep a seperate model for the meal itself
const mealSchema = new mongoose.Schema({
  dailyMealPlan: {
    type: mongoose.Schema.ObjectId,
    ref: 'dailyMealPlan',
  },
  // each meal is only for one mealplan
  // otherwishe change in a meal will result change
  // in all the other mealplans - unwanted
  // instead the user will be able to ask meal
  // templates examples
  type: {
    type: String,
    required: [
      true,
      'Please provide type of meal. (breakfast/lunch/dinner/snack)',
    ],
  },
  totalNutrients: {
    calories: Number,
    protein: Number,
    fat: Number,
    carbs: Number,
  },
  recipe: {
    _id: false,
    id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Recipe',
    },
    servingSize: {
      measure: {
        type: String,
        default: 'gram',
        required: [true, 'Provide reciepe measure.'],
        amount: {
          type: Number,
          required: [true, 'How many servings of this food?'],
        },
        // If grams is specified amount has no meaning
        grams: {
          type: Number,
        },
      },
    },
  },
  items: [
    {
      _id: false,
      id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Food',
      },
      servingSize: {
        measure: {
          type: String,
          default: 'gram',
          required: [true, 'Provide food measure.'], // TODO: required?
        },
        amount: {
          type: Number,
          required: [true, 'How many servings of this food?'],
        },
        // If grams is specified amount has no meaning
        grams: {
          type: Number,
        },
      },
    },
  ],
});

const calculateMealNutrients = async function (foodObjects) {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;
  for (let i = 0; i < foodObjects.length; i++) {
    const { grams } = this.foods[i].servingSize;
    calories += foodObjects[i].nutrients.calories * (grams / 100);
    protein += foodObjects[i].nutrients.protein * (grams / 100);
    carbs += foodObjects[i].nutrients.carbs * (grams / 100);
    fat += foodObjects[i].nutrients.fat * (grams / 100);
    fiber += foodObjects[i].nutrients.fiber * (grams / 100);
  }

  this.nutrients.calories = calories;
  this.nutrients.protein = protein;
  this.nutrients.carbs = carbs;
  this.nutrients.fat = fat;
  this.nutrients.fiber = fiber;
};

const calculateGramsOfFoods = async function (foodObjects) {
  for (let i = 0; i < this.foods.length; i++) {
    // If user didn't specify grams

    if (!this.foods[i].servingSize.grams) {
      this.foods[i].servingSize.grams =
        foodObjects[i].measures.find(
          (o) => o.name === this.foods[i].servingSize.measure
        ).weight * this.foods[i].servingSize.amount;
    }
  }
};

mealSchema.pre('save', async function (next) {
  const foodIds = this.foods.map((f) => f.id);
  const foodObjects = await Food.find({ _id: { $in: foodIds } });

  // Sorting for improving time complexity

  this.foods.sort();
  foodObjects.sort((a, b) => a._id - b._id);

  await calculateGramsOfFoods.call(this, foodObjects);
  await calculateMealNutrients.call(this, foodObjects);

  next();
});

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;
