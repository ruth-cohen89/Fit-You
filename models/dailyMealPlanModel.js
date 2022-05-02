const mongoose = require('mongoose');

// We need the mealPlan schema since
// if we would not have it then the user could enter
// each meal with different amount of calories and
// we need to make sure that the daily calories remain the
// same since creation
// we have to keep the same daily calories somewhere throw all the user program
// and also link it to the user, this makes it organized
// also, if the user wished to change a meal he would have to
// change the whole dailyMealPlan schema (bad), and could harm the daily values.
const mealPlanSchema = new mongoose.Schema({
  caloriesPerDay: Number,
  // day: {
  //   type: String,
  //   required: [true, 'Choose a day.'],
  //   enum: [
  //     'Sunday',
  //     'Monday',
  //     'Tuesday',
  //     'Wedensday',
  //     'Thursday',
  //     'Friday',
  //     'Saturday',
  //   ],
  // },
  // program: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Program',
  //   required: [true, 'Meal plan must belong to a program'],
  //   unique: true,
  // },
  meals: [
    {
      id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Meal',
        required: [true, 'What meals would you like to have? :)'],
      },
      name: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: [true, 'What type of meal is it?'],
      },
      hour: String,
    },
  ],
});

const dailyMealPlan = mongoose.model('Meal', mealPlanSchema);
module.exports = dailyMealPlan;

// TODO: think about how to create the validation and wether or not keep
// the daily macros here/ calculted from meals?
// For each macro that the user provides we need to
// validate wether the meals stand it
// calories: {
//   type: Number,
//   required: [true, 'Please provide amount of calories.'],
// },
// protein: {
//   type: Number,
// },
// carbs: Number,
// fat: Number,