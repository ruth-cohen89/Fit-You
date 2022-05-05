const Exercise = require('../models/exerciseModel');
const factory = require('./handlerFactory');

exports.createExercise = factory.createOne(Exercise);
exports.getAllExercises = factory.getAll(Exercise);
exports.getExercise = factory.getOne(Exercise);
exports.updateExercise = factory.updateOne(Exercise);
exports.deleteExercise = factory.deleteOne(Exercise);
