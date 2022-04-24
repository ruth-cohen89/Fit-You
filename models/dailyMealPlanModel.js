const mongoose = require('mongoose');

// We need the mealPlan schema since
// if we would not have it then the user could enter
// each meal with different amount of calories and
// we need to make sure that the daily calories remain the
// same since creation
// we have to keep the same daily calories somewhere throw all the user program
// and also link it to the user, this makes it organized
const dailymealPlanSchema = new mongoose.Schema({
  dayOfWeek: {
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
  calories: {
    type: Number,
    required: [true, 'Please provide amount of calories.'],
  },
  protein: {
    type: Number,
  },
  carbs: Number,
  fat: Number,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Meal plan must belong to a user'],
    unique: true,
  },
  meals: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Meal',
      required: [true, 'What meals would you like to have? :)'],
    },
  ],
});

const dailyMealPlan = mongoose.model('Meal', dailymealPlanSchema);
module.exports = dailyMealPlan;
