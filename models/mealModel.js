/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const Program = require('./programModel');

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
      itemType: {
        type: String,
        required: [true, 'Choose between Food and Recipe'],
        enum: ['Food', 'Recipe'],
      },
      name: {
        type: String,
        required: [true, 'what is the food name?'],
      },
      calories: {
        type: Number,
        required: [true, 'Please provide calories for this amount of food'],
      },
      protein: {
        type: Number,
        required: [true, 'Please provide protein for this amount of food'],
      },
      carbs: Number,
      fat: Number,
      servingSize: {
        type: {
          type: String,
          required: [true, 'Please provide type of measure.'],
        },
        amount: {
          type: Number,
          required: [true, 'Please provide amount of serving.?'],
        },
      },
      image: String,
      proteinCalorieRatio: Number,
      url: String,
      yield: Number,
      ingredients: [String],
    },
  ],
});

const validateMacros = async function () {
  let program = await Program.find({ id: this.program });
  program = program[0];

  const dailyMeals = await Meal.find({
    program: this.program,
    day: this.day,
  });
//
  if (dailyMeals) {
    const allCalories = dailyMeals.reduce(
      (acc, m) => acc + m.totalNutrients.calories,
      0
    );

    if (allCalories + this.totalNutrients.calories > program.caloriesPerDay) {
      const gap =
        allCalories + this.totalNutrients.calories - program.caloriesPerDay;
      console.error(
        `You have reached your daily amount of calories by ${gap}, Please change one of your meals 🥨`
      );
    }

    const allProtein = dailyMeals.reduce(
      (acc, m) => acc + m.totalNutrients.protein,
      0
    );

    if (allProtein + this.totalNutrients.protein < program.proteinPerDay) {
      console.error(
        'You have not reached your minimum recommended daily amount of protein, Please add more protein to your meals.'
      );
    }

    if (program.carbsPerDay && this.totalNutrients.carbs) {
      const allCarbs = dailyMeals.reduce(
        (acc, m) => acc + m.totalNutrients.carbs,
        0
      );

      if (allCarbs + this.totalNutrients.carbs > program.carbsPerDay) {
        console.error(
          'Too much carbs for that day, Please change one of your meals'
        );
      }
    }
    if (program.fatPerDay && this.totalNutrients.fat) {
      const allFat = dailyMeals.reduce(
        (acc, m) => acc + m.totalNutrients.fat,
        0
      );
      if (allFat + this.totalNutrients.fat > program.fatPerDay) {
        console.error(
          'Too much fat for that day, Please change one of your meals'
        );
      }
    }
  }
};

mealSchema.pre('save', async function (next) {
  await validateMacros.call(this);
  next();
});

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;
