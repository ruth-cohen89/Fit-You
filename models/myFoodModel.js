const mongoose = require('mongoose');
const slugify = require('slugify');

const myFoodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'userSchema',
    required: [true, 'Please provide user id'],
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
      // required: [true, 'How much fat?'],
    },
    carbs: {
      type: Number,
      // required: [true, 'How many carbs?'],
    },
    fiber: {
      type: Number,
      // required: [true, 'How much fiber?'],
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
        //required: [true, 'Please provide measuring type (grams/cup/etc).'], //cup (quinoa)
      },
      weight: {
        type: Number,
        //required: [true, 'Please provide weight of measure in grams.'], //200 (grams)
      },
      calories: Number, // 200 (calories)
    },
  ],
  // myFoodsId: String (of the external API)
  proteinCalorieRatio: Number,
  image: String,
});

myFoodSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.proteinCalorieRatio = this.nutrients.protein / this.nutrients.calories;
  next();
});

const MyFood = mongoose.model('myFoods', myFoodSchema);
module.exports = MyFood;
