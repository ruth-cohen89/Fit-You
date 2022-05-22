const mongoose = require('mongoose');
const slugify = require('slugify');

const recipeSchema = new mongoose.Schema({
  // If recipe was created by a user
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Please provide name of recipe.'],
  },
  totalWeight: {
    type: Number,
    required: [true, 'How much does it weigh?'],
  },
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
    saturedFat: Number,
    transFat: Number,
    fiber: Number,
    sugars: Number,
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

  // If recipe belongs to the popular recipe repository
  // isPopular: {
  //   type: Boolean,
  //   default: false,
  // },
  url: String,
  yield: Number,
  ingredients: [{ type: String }],
});

recipeSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.proteinCalorieRatio = this.nutrients.protein / this.nutrients.calories;
  next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
