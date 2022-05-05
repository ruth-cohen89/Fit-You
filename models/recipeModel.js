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
      required: [true, 'How many calories?'],
    },
    fat: {
      type: Number,
      required: [true, 'How much fat?'],
    },
    saturedFat: Number,
    transFat: Number,
    carbs: {
      type: Number,
      required: [true, 'How many carbs?'],
    },
    fiber: {
      type: Number,
      required: [true, 'How much fiber?'],
    },
    sugars: Number,
    protein: {
      type: Number,
      required: [true, 'How much protein?'],
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
    calories: Number,
  },
  measures: [
    {
      _id: false,
      name: {
        type: String,
        required: [true, 'Please provide measure type (grams/cup/etc).'],
      },
      weight: {
        type: Number,
        required: [true, 'Please provide weight of measure (in grams).'],
      },
      calories: Number,
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
