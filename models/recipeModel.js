const mongoose = require('mongoose');
const slugify = require('slugify');

const recipeSchema = new mongoose.Schema({
  name: {
    // label
    type: String,
    required: [true, 'Please provide name of recipe.'],
    unique: true,
  },
  foodId: String,
  ingredientLines: [{ ingredient: String }],
  healthLabels: [{ label: String }],
  url: String, //the recipe url +instructions
  yield: Number, // servings
  totalWeight: Number,
  proteinCalorieRatio: Number,
  image: String,

  totalNutrients: {
    // per total weight
    calories: {
      type: Number,
      required: [true, 'How many calories are in this recipe?'],
    },
    protein: {
      type: Number,
      required: [true, 'How much protein is in this recipe?'],
    },
    fat: {
      type: Number,
      required: [true, 'How much fat is in this recipe?'],
    },
    carbs: {
      type: Number,
      required: [true, 'How much fat is in this recipe?'],
    },
    fiber: {
      type: Number,
      required: [true, 'How much fiber is in this recipe?'],
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
      weight: Number, // in grams
    },
  ],
});

recipeSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.proteinCalorieRatio = this.nutrients.protein / this.nutrients.calories;
  next();
});

const Recipe = mongoose.model('recipe', recipeSchema);
module.exports = Recipe;
