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
      id: {
        type: mongoose.Schema.ObjectId,
        ref: 'exercise',
        required: [true, 'please enter exercise id :)'],
      },
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
  caloriesBurned: Number,
});

workoutSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'exercises.id',
    select: '-__v',
  });
  next();
});

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;
