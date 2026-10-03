const mongoose = require('mongoose');
const slugify = require('slugify');

const foodSchema = new mongoose.Schema({
  // creator of food
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Please provide name of food.'],
  },
  // Used for fast case-insensitive lookups before falling back to EDAMAM.
  normalizedName: {
    type: String,
    trim: true,
  },
  totalWeight: {
    // grams
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

  // If food belongs to the popular food repository
  isPopular: {
    type: Boolean,
    default: false,
  },
});

// Fast local lookup for foods before calling the external EDAMAM API.
foodSchema.index({ normalizedName: 1 });

// Optimize popular-food queries that filter by popularity and rank by protein/calorie ratio.
foodSchema.index({ isPopular: 1, proteinCalorieRatio: -1 });

foodSchema.pre('validate', function (next) {
  if (this.name) this.normalizedName = this.name.trim().toLowerCase();
  next();
});

foodSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.proteinCalorieRatio = this.nutrients.protein / this.nutrients.calories;
  next();
});

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
