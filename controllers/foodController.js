const Food = require('../models/foodModel');
//const Meal = require('../models/mealModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.aliasTopProteinFoods = catchAsync(async (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-proteinCalorieRatio';
  req.query.fields =
    'name,proteinCalorieRatio,nutrients.protein,nutrients.calories';
  next();
});

exports.getMyFoods = catchAsync(async (req, res, next) => {
  const foods = await Food.find({ user: req.user._id });
  if (foods.length === 0) {
    return next(new AppError('User has not created any foods.', 400));
  }

  res.status(200).json({
    status: 'success',
    results: foods.length,
    data: {
      data: foods,
    },
  });
});

exports.createFood = factory.createOne(Food);
exports.getAllFoods = factory.getAll(Food);
exports.getFood = factory.getOne(Food);
exports.updateFood = factory.updateOne(Food);
exports.deleteFood = factory.deleteOne(Food);
