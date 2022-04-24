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
          required: [true, 'How much would you like to eat, dear?'],
        },
      },
    },
  ],
});

//mealSchema.index({ name: 1, ratingsAverage: -1 }, { unique: true });

// TODO: fix the work
mealSchema.pre('save', async function (req, next) {

  console.log(this, 'com');
  const foodIds = this.foods.map((e) => e.food);

  const foods = await Food.find({ _id: { $in: foodIds } });

  console.log(foods, 'later1');
  const macros = ['calories', 'protein', 'carbs', 'fat', 'fiber'];

  //const { measure, amount } = this.foods.servingSize;
  //const newFoodMeasures = this.foods.forEach((food) => food.foods.measure)
  newFoods = {}
  for(let i=0; i<this.foods.length; i++) {
    newFoods[this.foods[i].food] = this.foods[i].servingSize
  }

  console.log(newFoods)
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < macros.length; i++) {
    // eslint-disable-next-line no-unused-vars
    foods.forEach((food) => food.measures[])

    const { macro, weight } = foods.map((f) => ({
      macro: f.nutrients.macros[i],
      weight: f.measures.find(
        ((m) => m.name === this.foods[i].servingSize.measure).weight
      ), //* this.foods[i].servingSize.amount
    }));
    //this.macros[i] = macro * ((weight * amount) / 100); // 2 times 4 cubes of chocolate is 25*2=50g
  }
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
