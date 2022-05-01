const mongoose = require('mongoose');

const exercisePlanSchema = new mongoose.Schema({
  day: {
    type: String,
    required: [true, 'Choose a day.'],
    enum: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wedensday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'exercise plan must belong to a user'],
    unique: true,
  },
  exercises: [
    {
      id: {
        type: mongoose.Schema.ObjectId,
        ref: 'exercise',
        required: [true, 'What is your training program? :)'],
      },
      duration: Number, // in seconds
    },
  ],
  totalCalorieBurned: Number,
  totalDuration: Number,
});

const dailyexercisePlan = mongoose.model('exercise', exercisePlanSchema);
module.exports = dailyexercisePlan;
