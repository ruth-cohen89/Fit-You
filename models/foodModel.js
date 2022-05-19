const mongoose = require('mongoose');
const slugify = require('slugify');

const foodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Please provide name of food.'],
    unique: true,
  },
  totalWeight: Number, // in grams
  nutrients: {
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
      required: [true, 'How much fat?'],
    },
    carbs: {
      type: Number,
      required: [true, 'How many carbs?'],
    },
    fiber: {
      type: Number,
      required: [true, 'How much fiber?'],
    },
  },
  defaultServing: {
    name: String,
    weight: Number,
    calories: Number,
  },
  measures: [
    {
      _id: false,
      type: {
        type: String,
      },
      weight: {
        type: Number,
      },
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
