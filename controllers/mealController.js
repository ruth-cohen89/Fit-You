/* eslint-disable prettier/prettier */
// const { crossOriginResourcePolicy } = require('helmet');
const ObjectId = require('mongodb').ObjectID;
const Meal = require('../models/mealModel');
const Program = require('../models/programModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');


exports.getRecentlyUsedItems = catchAsync(async (req, res, next) => {
  const userMeals = await Meal.find({ program: req.params.programId });
  if (!userMeals) {
    return next(new AppError('No meals were assigned to this program.', 400));
  }

  let usedItems = userMeals.map((m) => m.items);
  usedItems = usedItems.flat();
//
  res.status(200).json({
    status: 'success',
    results: usedItems.length,
    data: {
      data: usedItems,
    },
  });
});

exports.clearMealPlanDay = catchAsync (async (req, res, next) => {
  const meals = await Meal.find({ program: req.params.programId, day: req.params.day });

  if (meals.length === 0) {
     return next(new AppError(`There are no meals on ${req.params.day}`, 404));
  };

  await Meal.deleteMany({ program: req.params.programId, day: req.params.day });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteFoodFromMeal = catchAsync(async (req, res, next) => {
  const meal = await Meal.findOne({ _id: req.params.id});
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

exports.getDailyMealPlan = catchAsync(async (req, res, next) => {
  const meals = await Meal.aggregate([
    {
      $match: {
        $and: [
          { program: ObjectId(req.params.programId) },
          { day: req.params.day },
        ],
      },
    },
    {
      $addFields: {
        sortField:
        { $cond: [
            { $eq: ['$type', 'breakfast'] },
            0,
        { $cond: [{ $eq: ['$type', 'lunch'] }, 1,
        { $cond: [{ $eq: ['$type', 'dinner'] }, 2,
        { $cond: [{ $eq: ['$type', 'snack'] }, 3, 4
      ]} ]} ]} ]} 
    }},
    { $sort: { sortField: 1 } }
  ]);

  res.status(200).json({
    status: 'success',
    results: meals.length,
    data: {
      data: meals,
    },
  });
});

exports.getWeeklyMealPlan = catchAsync(async (req, res, next) => {
  const shit = req.params.programId;

  const meals = await Meal.aggregate([
    { $match: { program: ObjectId(shit) } },

    {
      $addFields: {
        sortDay:
         { $cond: [
            { $eq: ['$day', 'Sunday'] }, 0,
            { $cond: [{ $eq: ['$day', 'Monday'] }, 1,
            { $cond: [{ $eq: ['$day', 'Tuesday'] }, 2,
            { $cond: [{ $eq: ['$day', 'Wedensday'] }, 3,
            { $cond: [{ $eq: ['$day', 'Thursday'] }, 4,
            { $cond: [{ $eq: ['$day', 'Friday'] }, 5,
            { $cond: [{ $eq: ['$day', 'Saturday'] }, 6, 7
            ]} ]} ]} ]} ]} ]}  ]},
        sortType:
        { $cond: [
            { $eq: ['$type', 'breakfast'] },
            0,
        { $cond: [{ $eq: ['$type', 'lunch'] }, 1,
        { $cond: [{ $eq: ['$type', 'dinner'] }, 2,
        { $cond: [{ $eq: ['$type', 'snack'] }, 3, 4
      ]} ]} ]} ]} 
    }},
    { $sort: { sortDay: 1, sortType: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    results: meals.length,
    data: {
      data: meals,
    },
  });
});

exports.createMeal = factory.createOne(Meal);
exports.getAllMeals = factory.getAll(Meal);
exports.getMeal = factory.getOne(Meal);
exports.updateMeal = factory.updateOne(Meal);
exports.deleteMeal = factory.deleteOne(Meal);
