const Food = require('../models/foodModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopFoods = (req, res, next) => {
  req.query.limit = '10';//TODO: this
  req.query.sort = 'nutrients.calories,protein';
  req.query.fields = 'name,nutrients,protein';
  next();
};

exports.createFood = factory.createOne(Food);
exports.getAllFoods = factory.getAll(Food);
exports.getFood = factory.getOne(Food);
exports.updateFood = factory.updateOne(Food);
exports.deleteFood = factory.deleteOne(Food);
