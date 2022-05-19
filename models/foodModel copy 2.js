const mongoose = require('mongoose');
const slugify = require('slugify');

const myFoodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'myFood object must belong to a user'],
  },
  name: {
    type: String,
    required: [true, 'Please provide name of food.'],
  },
  totalWeight: Number, // in grams
  nutrients: {
    // for dafault serving
    calories: {
      type: Number,
      required: [true, 'How many calories?'],
    },
    protein: {
      type: Number,
      required: [true, 'How much protein?'],
    },
    fat: {
      type: Number,
    },
    carbs: {
      type: Number,
    },
    fiber: {
      type: Number,
    },
  },
  defaultServing: {
    name: {
      type: String,
      required: [true, 'Please provide name of default serving'],
    },
    weight: {
      type: Number,
      required: [true, 'Please provide weight of default serving'],
    },
    calories: Number,
  },
  measures: [
    {
      _id: false,
      type: String,
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

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
