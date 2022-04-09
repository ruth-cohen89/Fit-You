const mongoose = require('mongoose');
const validator = require('validator');

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workout must have a name ;)'],
  },
  type: {
    type: String,
    enum: ['Aerobic', 'BodyWeight', 'Weights'],
    required: [true, 'Please choose type of program!'],
  },
  duration: Number,
  link: String,
  caloriesBurned: Number,
});

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;
