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
  name: {
    type: String,
    required: [true, 'Please provide name of meal.'],
    enum: ['breakfast', 'lunch', 'dinner', 'snack'], 
  },
  hour: String,
  slug: String,
  // calculating macros for the meal at create and update
  calories: Number,
  protein: Number,
  fat: Number,
  carbs: Number,

  // foodIds
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
        }
      },
    },
  ],
});

//mealSchema.index({ name: 1, ratingsAverage: -1 }, { unique: true });

// TODO: fix the work
mealSchema.pre('save', async function (req, next) {

  // console.log(this, 'com');
  const foodIds = this.foods.map((e) => e.food);
  const foods = await Food.find({ _id: { $in: foodIds } });

  //console.log(foods, 'later1');
  // we cant run macro[i] since the nutrients and macroNames
  // may not always be in the same order... we have to use 2 loops.
  const macroNames = ['calories', 'protein', 'carbs', 'fat', 'fiber'];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < macroNames.length; i++) {
    const AllFoodsMacro = foods.reduce((f1, f2) => ({
      macro: (f.nutrients.macros[i] * (this.foods.food.servingSize.weight / 100)) , 
    }));
    this.macros[i] = AllFoodsMacro;
  }
  //macro * ((weight * amount) / 100);
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

  // const measuresOfFood = foods[0];
  // const foundMeasureObject = measuresOfFood.find((m) => m === measure );
  // const weight = foundMeasureObject.weight;

  //const meausreInGrams = Food.find({measures:})
  // calcuting if user inserted in grams or not at all
