const Meal = require('../models/mealModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const checkTotalMacro = catchAsync(async (macro, targetMacro, name, next) => {
  if (macro > targetMacro) {
    next(new AppError(`You have exceeded the daily amount of ${name}!`));
  }
});

// Check whether the inserted meals stand in the required daily macros
exports.checkDailyMacros = catchAsync(async (req, res, next) => {
  const { meals } = req.body;

  const totalCalories = meals.reduce((m1, m2) => m1.calories + m2.calories);
  checkTotalMacro(totalCalories, req.body.calories, 'calories', next);

  if (req.body.calories) {
    const totalProtein = meals.reduce((m1, m2) => m1.protein + m2.protein);
    checkTotalMacro(totalProtein, req.body.protein, 'protein', next);
  }

  if (req.body.carbs) {
    const totalCarbs = meals.reduce((m1, m2) => m1.carbs + m2.carbs);
    checkTotalMacro(totalCarbs, req.body.carbs, 'carbs', next);
  }

  if (req.body.fats) {
    const totalFats = meals.reduce((m1, m2) => m1.fats + m2.fats);
    checkTotalMacro(totalFats, req.body.fats, 'fats', next);
  }
  next();
});

exports.createMealPlan = factory.createOne(Meal);
exports.getAllMealPlans = factory.getAll(Meal);
exports.getMealPlan = factory.getOne(Meal);
exports.updateMealPlan = factory.updateOne(Meal);
exports.deleteMealPlan = factory.deleteOne(Meal);
