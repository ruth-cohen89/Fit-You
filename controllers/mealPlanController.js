const Meal = require('../models/mealModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const checkTotalMacro = (macro, expectedValue, msg) => {
  const mealsTotalMacro = meal.reduce((m1, m2) => m1.macro + m2.macro);
  if (mealsTotalMacro > expectedValue) {
    next(new AppError(msg));
  }'You have exceeded the daily amount of calories!'
};

// Add one meal
exports.checkDailyMacros = catchAsync(async (req, res, next) => {
  const { meals } = req.body;
  
});
//do the meals stand in the day macros, add all meals at once
exports.checkDailyMacros = catchAsync(async (req, res, next) => {
  const { meals } = req.body;
  checkTotalMacro(calories, req.body)
  const mealsCalories = meal.reduce((m1, m2) => m1.calories + m2.calories);
  if (mealsCalories > req.body.calories) {
    next(new AppError('You have exceeded the daily amount of calories!'))
  }
  if (req.body.protein) {

    const allProtein = 
  }

  if
  const allCarbs = 
  const allFatn = 
});
exports.createMeal = factory.createOne(Meal);
exports.getAllmeals = factory.getAll(Meal);
exports.getMeal = factory.getOne(Meal);
exports.updateMeal = factory.updateOne(Meal);
exports.deleteMeal = factory.deleteOne(Meal);
