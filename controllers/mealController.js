/* eslint-disable prettier/prettier */
// const { crossOriginResourcePolicy } = require('helmet');
const ObjectId = require('mongodb').ObjectID;
const Meal = require('../models/mealModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

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

// recipes need to be fixed in 2 below functions
exports.getDailyMealPlan = async (req, res, next) => {
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
      $project: {
        day: 1,
        type: 1,
        totalNutrients: 1,
        items: 1,
      },
    },
    {
      $lookup: {
        from: 'foods',
        localField: 'items.itemId',
        foreignField: '_id',
        as: 'item',
      },
    },
    {
      $unwind: '$item',
    },
    // {
    //   $lookup: { 
    //     from: 'recipes',
    //     localField: 'items.itemId',
    //     foreignField: '_id',
    //     as: 'recipes',
    //   },
    // },
    // {
    //   $unwind: '$recipes',
    // },{ '$arrayElemAt': ['$items.name', 0]},
    {
      $project: {
        _id: false,
        day: 1,
        'meal': '$type',
        'name': '$item.name',
        //'servingSize': {'$toString': { '$arrayElemAt': ['$items.servingSize.amount', 0]}},
        //'serving size':  { '$concatArrays': [ {'$toString': { '$arrayElemAt': ['$items.servingSize.amount', 0]}},' ',  '$items.servingSize.type'] },
        'serving size': {
          '$let': {
            'vars': { 'amount': {'$toString': { '$arrayElemAt': ['$items.servingSize.amount', 0] }}, 'type': { '$arrayElemAt': ['$items.servingSize.type', 0] }},
            'in': { '$concat': [ '$$amount', ' ', '$$type' ] }
          }
        },
        'nutrients': '$item.nutrients',
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
    { $sort: { sortField: 1 } },
    // {$group: {_id: { totalNutrients: {$sum: '$totalNutrients'}}}},
  ]);
  res.status(200).json({
    status: 'success',
    results: meals.length,
    data: {
      data: meals,
    },
  });
};
exports.getWeeklyMealPlan = async (req, res, next) => {
  console.log('hi')
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
};
exports.createMeal = factory.createOne(Meal);
exports.getAllMeals = factory.getAll(Meal);
exports.getMeal = factory.getOne(Meal);
exports.updateMeal = factory.updateOne(Meal);
exports.deleteMeal = factory.deleteOne(Meal);
