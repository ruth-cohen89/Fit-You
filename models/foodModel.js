const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name of food.'],
    unique: true,
  },
  foodId: String,
  label: String,
  nutrients: {
    calories: Number,
    protein: Number,
    fat: Number,
    carbs: Number,
    fiber: Number,
  },
  slug: String,
});

// mealSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// const Meal = mongoose.model('Meal', mealSchema);
// module.exports = Meal;
