const Meal = require('../models/mealModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.isEnoughCalories = (req, res, next) => {
  
};
//const totalCalories = this.foods.reduce((m1, m2) => m1.calories + m2.calories);
//const foods = Food.find({id: req.body.foods})
//this.calories = this.foods//TODO: macros
exports.createMeal = factory.createOne(Meal);
exports.getAllmeals = factory.getAll(Meal);
exports.getMeal = factory.getOne(Meal);
exports.updateMeal = factory.updateOne(Meal);
exports.deleteMeal = factory.deleteOne(Meal);
