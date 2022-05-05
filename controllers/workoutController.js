const Workout = require('../models/workoutModel');
const factory = require('./handlerFactory');

exports.createWorkout = factory.createOne(Workout);
exports.getAllWorkouts = factory.getAll(Workout);
exports.getWorkout = factory.getOne(Workout);
exports.updateWorkout = factory.updateOne(Workout);
exports.deleteWorkout = factory.deleteOne(Workout);
