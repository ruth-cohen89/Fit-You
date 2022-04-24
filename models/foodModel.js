const mongoose = require('mongoose');
//const validator = require('validator');
const slugify = require('slugify');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name of food.'],
    unique: true,
  },
  //food id from the external API
  //foodId: String,
  // all required so that the calculated
  // macros for a meal will be accurate
  // Add more macros?
  nutrients: {
    calories: {
      type: Number,
      required: [true, 'How many calories are in this food?'],
    },
    protein: {
      type: Number,
      required: [true, 'How much protein is in this food?'],
    },
    fat: {
      type: Number,
      required: [true, 'How much fat is in this food?'],
    },
    carbs: {
      type: Number,
      required: [true, 'How much fat is in this food?'],
    },
    fiber: {
      type: Number,
      required: [true, 'How much fiber is in this food?'],
    },
  },
  defaultServing: {
    name: String,
    weight: Number,
  },
  measures: [
    {
      _id: false,
      name: String,
      weight: Number,
    },
  ],
  proteinCalorieRatio: Number,
  image: String,
});

foodSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.proteinCalorieRatio = this.nutrients.protein / this.nutrients.calories;
  next();
});

// foodSchema.pre(/^find/, function (next) {
//   this.populate({
//     select: '-__v',
//   });
//   next();
// });
const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
