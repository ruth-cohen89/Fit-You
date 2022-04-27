/* eslint-disable no-plusplus */
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
  hour: String,
  // each meal is only for one mealplan
  // otherwishe change in a meal will result change
  // in all the other mealplans - unwanted
  // instead the user will be able to ask meal
  // templates examples
  name: {
    type: String,
    required: [true, 'Please provide name of meal.'],
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
  },
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
      id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Food',
        required: [true, 'What foods would you like to eat?'],
      },
      // in grams
      servingSize: {
        measure: {
          type: String,
          default: 'gram', // gram/tbsp/...
          required: [true, 'Provide food measure.'],
        },
        amount: {
          type: Number, //100 /1
          required: [true, 'How many servings of this food?'],
        },
        grams: {
          type: Number, // 100 /25
        },
      },
    },
  ],
});

const calculateMealNutrients = async (foodObjects) => {
  const mapOfWeights = {}; // foodID: weight(grams)
  // map of foodId:weight(g)
  for (let i = 0; i < this.foods.length; i++) {
    mapOfWeights[this.foods[i].id] = this.foods[i].servingSize.weight;
  }
  console.log(mapOfWeights);

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
};

const calculateFoodGrams = async (foodObjects) => {
  // putting them both in alignment
  this.foods.sort((a, b) => a.id - b.id);
  foodObjects.sort((a, b) => a._id - b._id);

  console.log(this.foods);
  console.log(foodObjects);

  for (let i = 0; i < this.foods.length; i++) {
    //if user didn't specify grams - we specify it.
    if (!this.foods[i].servingSize.grams) {
      this.foods[i].servingSize.weight =
        foodObjects[i].measures.find({
          name: this.foods[i].name,
        }).weight * this.foods[i].servingSize.amount;
    }
  }
};

// TODO: fix the work
mealSchema.pre('save', async function (req, res, next) {
  const foodIds = this.foods.map((f) => f.id);
  console.log(String(this.foods[0].id));
  console.log(foodIds);

  const foodObjects = await Food.find({ _id: { $in: foodIds } });
  console.log(foodObjects)
  // await calculateFoodGrams.call(this, foodObjects);
  // await calculateMealNutrients.call(this, foodObjects);

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
