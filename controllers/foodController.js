const Food = require('../models/foodModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopProteinFoods = catchAsync(async (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-proteinCalorieRatio';
  req.query.fields =
    'name,proteinCalorieRatio,nutrients.protein,nutrients.calories';
  next();
});

exports.createFood = factory.createOne(Food);
exports.getAllFoods = factory.getAll(Food);
exports.getFood = factory.getOne(Food);
exports.updateFood = factory.updateOne(Food);
exports.deleteFood = factory.deleteOne(Food);
