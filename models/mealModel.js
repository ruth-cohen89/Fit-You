/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const Food = require('./foodModel');
const Program = require('./programModel');


// const itemSchema = new mongoose.Schema(
//   {},
//   { discriminatorKey: 'kind', _id: false }
// );

// since meals in mealPlans are updated all the time,
// I keep a seperate model for the meal itself
const mealSchema = new mongoose.Schema({
  program: {
    type: mongoose.Schema.ObjectId,
    ref: 'programSchema',
  },
  date: {
    type: Date,
    required: [true, 'when will you eat this meal?'],
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
        // If grams is specified amount has no meaning
        grams: {
          type: Number,
        },
      },
    },
  ],
});

// before creating and updating a meal
const isEnoughCalories = async function () {
  const dailyCalories = Program.find({ _id: this.program }).caloriesPerDay;

  // eslint-disable-next-line no-use-before-define
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
  console.log(itemObjects)
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
  const itemIds = this.items.map((f) => f.itemId);

  //const itemObjects = await Meal.find().populate('items.itemId').sort();
  //console.log(itemObjects[0].items)

  const itemPromises = this.items.map(async (item) => {
    if (item.itemType === 'Food') {
      //return
      const bitch = await Food.find({ _id: { $in: itemIds } });
      return bitch;
    }
  });
  let itemObjects = await Promise.all(itemPromises)
  itemObjects = itemObjects[0];

  //   }
  // }
  //const itemObjects = await item.find({ _id: { $in: itemIds } });
  //await Meal.find({name : item.name}).count().exec();

  // Sorting for improving time complexity
  this.items.sort(); // by itemId
  itemObjects.sort((a, b) => a._id - b._id);

  //console.log(itemObjects)
  await calculateGramsOfItems.call(this, itemObjects);
  await calculateMealNutrients.call(this, itemObjects);
  await isEnoughCalories.call(this);
  next();
});

//mealSchema.path('items').discriminator('item', item);
//mealSchema.path('items').discriminator('recipe', Recipe);

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;
