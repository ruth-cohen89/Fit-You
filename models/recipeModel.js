const mongoose = require('mongoose');
const slugify = require('slugify');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name of recipe.'],
    unique: true,
  },
  //foodId: String,
  url: String,
  yield: Number, // servings
  dietLabels: [{ type: String }],
  healthLabels: [{ type: String }],
  ingredients: [{ type: String }],

  proteinCalorieRatio: Number,
  image: String,

  totalTime: Number,
  mealType: [{ type: String }],
  dishType: [{ type: String }],
  totalWeight: {
    type: Number,
    //required: [true, 'How much does it weight?'],
  },

  totalNutrients: {
    calories: {
      type: Number,
      required: [true, 'How many calories are in this recipe?'],
    },
    fat: {
      type: Number,
      required: [true, 'How much fat is in this recipe?'],
    },
    saturedFat: Number,
    transFat: Number,
    carbs: {
      type: Number,
      required: [true, 'How many carbs are in the recipe?'],
    },
    fiber: {
      type: Number,
      required: [true, 'How much fiber is in this recipe?'],
    },
    sugars: Number,
    protein: {
      type: Number,
      required: [true, 'How much protein is in this recipe?'],
    },
    cholesterol: Number,
    sodium: Number,
    calcium: Number,
    magnesium: Number,
    potassium: Number,
    iron: Number,
    zinc: Number,
  },

  defaultServing: {
    name: String,
    weight: Number,
  },
  measures: [
    {
      _id: false,
      name: String,
      weight: Number, // grams
    },
  ],
});

recipeSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.proteinCalorieRatio =
    this.totalNutrients.protein / this.totalNutrients.calories;
  next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
