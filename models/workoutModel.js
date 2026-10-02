const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  program: {
    type: mongoose.Schema.ObjectId,
    ref: 'programSchema',
    required: [true, 'Please enter program id'],
  },
  name: {
    type: String,
  },
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

  exercises: [
    {
      name: {
        type: String,
        required: [true, 'Please provide name of exercise.'],
      },
      type: {
        type: String,
        //required: [true, 'Please provide type of exercise'],
        enum: ['cardio', 'bodyWeight', 'weightLifting'],
      },
      url: String, // youtube video
      duration: {
        type: Number,
        //required: [true, 'Please enter exercise duraion in minutes'],
      },
      weight: {
        type: Number,
      },
      sets: {
        type: Number,
      },
      reps: {
        type: Number,
      },
      distance: {
        type: Number,
      },
    },
  ],

  // Add total duration
  totalDuration: Number,
  totalCaloriesBurn: Number,
});

// Allow one workout per day for each program, while keeping lookups efficient.
workoutSchema.index({ program: 1, day: 1 }, { unique: true });

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;
