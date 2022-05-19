const mongoose = require('mongoose');
const slugify = require('slugify');

const popularFoodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Please provide name of food.'],
    unique: true,
  },
  defaultServing: Number, //100g
  nutrients: {
    // per dafault serving
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
  servings: [
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
  image: String,
  proteinCalorieRatio: Number,
});

foodSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.proteinCalorieRatio = this.nutrients.protein / this.nutrients.calories;
  next();
});

foodSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.defaultServing = 100;
  next();
});

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
