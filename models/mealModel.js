const mongoose = require('mongoose');
const slugify = require('slugify');
//const { ObjectID } = require('mongodb');
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
  // name: {
  //   type: String,
  //   required: [true, 'Please provide name of meal.'],
  //   enum: ['breakfast', 'lunch', 'dinner', 'snack'],
  // },
  hour: String,
  slug: String,
  nutrients: {
    calories: Number,
    protein: Number,
    fat: Number,
    carbs: Number,
  },
  foods: [
    {
      _id: false,
      food: {
        type: mongoose.Schema.ObjectId,
        ref: 'Food',
        required: [true, 'What foods would you like to eat?'],
      },
      // in grams
      servingSize: {
        measure: {
          type: String,
          default: 'gram',
        },
        amount: {
          type: Number,
        },
        weight: {
          type: Number,
          required: [true, 'Please provide weight of serving in grams'],
        },
      },
    },
  ],
});

//mealSchema.index({ name: 1, ratingsAverage: -1 }, { unique: true });

// const calculateMacro = (macro) => {

// }
// TODO: fix the work
mealSchema.pre('save', async function (req, res, next) {
  const foodIds = [];
  const mapOfWeights = {}; // foodID: weight(grams)

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < this.foods.length; i++) {
    mapOfWeights[this.foods[i].food] = this.foods[i].servingSize.weight;
    foodIds[i] = this.foods[i].food;
  }
  const foodObjects = await Food.find({ _id: { $in: foodIds } });

  const AllFoodsMacros = foodObjects.reduce((f1, f2) => ({
    calories:
      f1.nutrients.calories * (mapOfWeights[f1._id] / 100) +
      f2.nutrients.calories * (mapOfWeights[f2._id] / 100),
    protein:
      f1.nutrients.protein * (mapOfWeights[f1._id] / 100) +
      f2.nutrients.protein * (mapOfWeights[f2._id] / 100),
    carbs:
      f1.nutrients.carbs * (mapOfWeights[f1._id] / 100) +
      f2.nutrients.carbs * (mapOfWeights[f2._id] / 100),
    fat:
      f1.nutrients.fat * (mapOfWeights[f1._id] / 100) +
      f2.nutrients.fat * (mapOfWeights[f2._id] / 100),
    fiber:
      f1.nutrients.fiber * (mapOfWeights[f1._id] / 100) +
      f2.nutrients.fiber * (mapOfWeights[f2._id] / 100),
  }));
  this.nutrients.calories = AllFoodsMacros.calories;
  this.nutrients.protein = AllFoodsMacros.protein;
  this.nutrients.carbs = AllFoodsMacros.carbs;
  this.nutrients.fat = AllFoodsMacros.fat;
  this.nutrients.fiber = AllFoodsMacros.fiber;

  next();
});

mealSchema.pre('save', function (req, res, next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

mealSchema.pre(/^find/, function (next) {
  this.populate({
    // TODO: populate foods
    select: '-__v',
  });
  next();
});

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;
