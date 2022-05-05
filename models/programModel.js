const mongoose = require('mongoose');

// Keep the macros here since it is constant, and not changing by day
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
  completeDate: {
    type: Date,
    required: [true, 'When will you reach your goal?'],
  },
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
  fiberPerDay: Number,
  workoutsPerWeek: {
    type: Number,
    required: [true, 'Get your body moving 🔥'],
  },
});

const Program = mongoose.model('Program', programSchema);
module.exports = Program;
