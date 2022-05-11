const Program = require('../models/programModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setProgramIdForUser = catchAsync(async (req, res, next) => {
  if (!req.body.program && req.user.role === 'user') {
    const program = await Program.findOne({ user: req.user.id });
    req.body.program = program.id;
  }
  next();
});

exports.getMyProgram = catchAsync(async (req, res, next) => {
  const program = await Program.findOne({ user: req.user._id });
  if (!program) {
    return next(
      new AppError('You do not have a program, Please create one.', 400)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: program,
    },
  });
});

exports.updateMyProgram = catchAsync(async (req, res, next) => {
  if (req.body.user) {
    return next(new AppError('You can not change user of program', 400));
  }

  const program = await Program.findOne({ user: req.user._id });
  if (!program) {
    return next(
      new AppError('You do not have a program, Please create one.', 400)
    );
  }

  const updatedProgram = await Program.findByIdAndUpdate(program.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      updatedProgram,
    },
  });
});

exports.createProgram = factory.createOne(Program);
exports.getAllPrograms = factory.getAll(Program);
exports.getProgram = factory.getOne(Program);
exports.updateProgram = factory.updateOne(Program);
exports.deleteProgram = factory.deleteOne(Program);
