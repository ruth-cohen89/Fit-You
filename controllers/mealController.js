const { crossOriginResourcePolicy } = require('helmet');
const Meal = require('../models/mealModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.deleteFoodFromMeal = catchAsync(async (req, res, next) => {
  const meal = await Meal.findOne({ _id: req.params.id });
  if (!meal) {
    return next(new AppError('No meal found with that ID', 404));
  }
  const mealIds = meal.foods.map((m) => String(m.id));
  const found = mealIds.includes(req.params.foodId);

  if (!found) {
    return next(new AppError('The meal does not contain such food!', 404));
  }

  const newMeal = await Meal.findByIdAndUpdate(
    { _id: req.params.id },
    { $pull: { foods: { id: req.params.foodId } } },
    { new: true }
  );
  // making the pre save hook work and calculate meal values.
  await newMeal.save();

  res.status(200).json({
    status: 'success',
    data: {
      data: newMeal,
    },
  });
});

exports.createMeal = factory.createOne(Meal);
exports.getAllmeals = factory.getAll(Meal);
exports.getMeal = factory.getOne(Meal);
exports.updateMeal = factory.updateOne(Meal);
exports.deleteMeal = factory.deleteOne(Meal);
