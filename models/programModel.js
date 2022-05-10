const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    unique: true,
    required: [true, 'Program must belong to a user'],
  },
  type: {
    type: String,
    enum: ['losingFat', 'recomposition', 'mass'],
    required: [true, 'Please choose type of program!'],
  },
  startDate: {
    type: Date,
    default: new Date(),
  },
  completeDate: {
    type: Date,
    required: [true, 'When will you reach your goal?'],
  },

  programChangedAt: Date,
  currentWeight: Number,
  goalWeight: Number,
  bmi: Number,

  caloriesPerDay: {
    type: Number,
    required: [true, 'How many calories would you consume every day?🥨'],
  },
  proteinPerDay: {
    type: Number,
    required: [true, 'How much protein would you consume every day?'],
  },

  carbsPerDay: Number,
  fatPerDay: Number,
  workoutsPerWeek: {
    type: Number,
    required: [true, 'Get your body moving 🔥'],
  },
});

programSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v -passwordChangedAt',
  });
  next();
});

programSchema.pre('update', function (next) {
  const date = new Date();
  this.programChangedAt = date;
  next();
});

exports.getMyProgram = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const Program = mongoose.model('Program', programSchema);
module.exports = Program;
