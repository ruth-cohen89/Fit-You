/* eslint-disable prettier/prettier */
const Workout = require('../models/workoutModel');
// eslint-disable-next-line import/order
const ObjectId = require('mongodb').ObjectID;
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getDailyWorkout = catchAsync(async (req, res, next) => {
  const workout = await Workout.aggregate([
    {
      $match: {
        $and: [
          { program: ObjectId(req.params.programId) },
          { day: req.params.day },
        ],
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: workout,
    },
  });
});

exports.getWeeklyWorkoutPlan = async (req, res, next) => {
  const programs = await Workout.aggregate([
    { $match: { program: ObjectId(req.params.programId) } },
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
      }},
    { $sort: { sortDay: 1 } },
  ]);
  res.status(200).json({
    status: 'success',
    results: programs.length,
    data: {
      data: programs,
    },
  });
};

exports.createWorkout = factory.createOne(Workout);
exports.getAllWorkouts = factory.getAll(Workout);
exports.getWorkout = factory.getOne(Workout);
exports.updateWorkout = factory.updateOne(Workout);
exports.deleteWorkout = factory.deleteOne(Workout);
