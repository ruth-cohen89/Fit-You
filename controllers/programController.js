const Program = require('../models/programModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getMyProgram = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};//??TODO

exports.updateMyProgram = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};//??TODO

exports.createProgram = factory.createOne(Program);
exports.getAllPrograms = factory.getAll(Program);
exports.getProgram = factory.getOne(Program);
exports.updateProgram = factory.updateOne(Program);
exports.deleteProgram = factory.deleteOne(Program);
