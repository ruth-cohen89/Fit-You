const Recipe = require('../models/recipeModel');
//const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.aliasTopProteinRecipes = catchAsync(async (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-proteinCalorieRatio';
  req.query.fields =
    'name,proteinCalorieRatio,nutrients.protein,nutrients.calories';
  next();
});

exports.getMyRecipes = catchAsync(async (req, res, next) => {
  const recipes = await Recipe.find({ user: req.user._id });
  if (recipes.length === 0) {
    return next(new AppError('User has not created any recipes.', 400));
  }

  res.status(200).json({
    status: 'success',
    results: recipes.length,
    data: {
      data: recipes,
    },
  });
});
exports.createRecipe = factory.createOne(Recipe);
exports.getAllRecipes = factory.getAll(Recipe);
exports.getRecipe = factory.getOne(Recipe);
exports.updateRecipe = factory.updateOne(Recipe);
exports.deleteRecipe = factory.deleteOne(Recipe);
