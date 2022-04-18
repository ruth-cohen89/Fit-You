const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name of food.'],
    unique: true,
  },
  foodId: String,
  label: String,
  nutrients: {
    calories: {
      type: Number,
      required: [true, 'How many calories are in this food?'],
    },
    protein: {
      type: Number,
      required: [true, 'How much protein is in this food?'],
    },
    fat: Number,
    carbs: Number,
    fiber: Number,
  },
  image: String,
});

// mealSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });
const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
