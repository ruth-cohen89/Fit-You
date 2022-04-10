const Program = require('../models/programModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createProgram = factory.createOne(Program);
exports.getAllPrograms = factory.getAll(Program);
exports.getProgram = factory.getOne(Program);
exports.updateProgram = factory.updateOne(Program);
exports.deleteProgram = factory.deleteOne(Program);
