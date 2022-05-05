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
    required: [true, 'Please provide program id'],
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
    calories: Number,
    protein: Number,
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
          required: [true, 'Provide amount of serving.?'],
        },
        grams: Number,
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

const calculateMealNutrients = async function (itemObjects) {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;

  for (let i = 0; i < itemObjects.length; i++) {
    const { grams } = this.items[i].servingSize;
    calories += itemObjects[i].nutrients.calories * (grams / 100);
    protein += itemObjects[i].nutrients.protein * (grams / 100);
    carbs += itemObjects[i].nutrients.carbs * (grams / 100);
    fat += itemObjects[i].nutrients.fat * (grams / 100);
    fiber += itemObjects[i].nutrients.fiber * (grams / 100);
  }

  this.totalNutrients.calories = calories;
  this.totalNutrients.protein = protein;
  this.totalNutrients.carbs = carbs;
  this.totalNutrients.fat = fat;
  this.totalNutrients.fiber = fiber;
};

const calculateGramsOfItems = async function (itemObjects) {
  // console.log('hoho', itemObjects[0])
  for (let i = 0; i < this.items.length; i++) {
    // If user didn't specify grams
    if (!this.items[i].servingSize.grams) {
      this.items[i].servingSize.grams =
        itemObjects[i].measures.find(
          (o) => o.name === this.items[i].servingSize.measure
        ).weight * this.items[i].servingSize.amount;
    }
  }
};

mealSchema.pre('save', async function (next) {
  if (!this.totalNutrients.calories) {
    const itemIds = this.items.map((f) => f.itemId);
    let itemObjects = [];
    itemObjects.push(await Food.find({ _id: { $in: itemIds } }));
    itemObjects.push(await Recipe.find({ _id: { $in: itemIds } }));
    itemObjects = itemObjects[0];

    itemObjects.sort((a, b) => a._id - b._id);
    console.log('this', this.items);
    console.log('items', itemObjects);

    await calculateGramsOfItems.call(this, itemObjects);
    await calculateMealNutrients.call(this, itemObjects);
  }
  await isEnoughCalories.call(this);
  next();
});

mealSchema.pre('/^find/', async function (next) {
  this.populate({
    path: 'items',
    select: -v -
  })
}
  
const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;
