const mongoose = require('mongoose');
const validator = require('validator');

const workoutSchema = new mongoose.Schema({
  program: {
    type: mongoose.Schema.ObjectId,
    ref: 'programSchema',
    required: [true, 'Please enter program id'],
  },
  link: String,
  name: {
    type: String,
  },
  // For convinient
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
      id: {
        type: mongoose.Schema.ObjectId,
        ref: 'exercise',
        required: [true, 'please enter exercise id :)'],
      },
      duration: {
        type: Number,
        required: [true, 'Please enter exercise duraion in minutes'],
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
  caloriesBurned: Number,
});

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;
