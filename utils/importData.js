const fetch = require('node-fetch');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const catchAsync = require('./catchAsync');
const Food = require('../models/foodModel');
const Recipe = require('../models/recipeModel');

// node ./utils/importData.js --importFood || deleteFood || importRecipe || deleteRecipe
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB 🙂'));

const createNewFood = catchAsync(async (ingr) => {
  const apiUri = `https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.EDAMAM_FOOD_APPID}&app_key=${process.env.EDAMAM_FOOD_APPKEY}&ingr=${ingr}&nutrition-type=cooking&category=generic-foods`;
  const response = await fetch(apiUri);
  const data = await response.json();

  // eslint-disable-next-line prefer-destructuring
  const food = data.parsed[0].food;
  const foodMeasures = data.hints[0].measures;
  const filteredServings = foodMeasures.map((serving) => ({
    type: serving.label,
    weight: serving.weight,
  }));

  const newFood = await Food.create({
    name: food.label,
    totalWeight: 100,
    nutrients: {
      calories: food.nutrients.ENERC_KCAL,
      protein: food.nutrients.PROCNT,
      fat: food.nutrients.FAT,
      carbs: food.nutrients.CHOCDF,
      fiber: food.nutrients.FIBTG,
    },
    servings: filteredServings,
    image: food.image,
    isPopular: true,
  });
  console.log(newFood, 'New food 😋');
});

const createNewRecipe = catchAsync(async (item) => {
  const query = item.replace(/ /g, '%20');
  const apiUri = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${process.env.EDAMAM_RECIPE_APPID}&app_key=${process.env.EDAMAM_RECIPE_APPKEY}`
  const response = await fetch(apiUri);
  const data = await response.json();

  const { recipe } = data.hits[0];

  const newRecipe = await Recipe.create({
    name: recipe.label,
    image: recipe.images.SMALL.url, //??
    url: recipe.url,
    yield: recipe.yield,
    ingredients: recipe.ingredientLines,
    totalWeight: recipe.totalWeight,
    totalTime: recipe.totalTime,

    nutrients: {
      calories: recipe.totalNutrients.ENERC_KCAL.quantity,
      fat: recipe.totalNutrients.FAT.quantity,
      saturedFat: recipe.totalNutrients.FASAT.quantity,
      transFat: recipe.totalNutrients.FATRN.quantity,
      carbs: recipe.totalNutrients.CHOCDF.quantity,
      fiber: recipe.totalNutrients.FIBTG.quantity,
      sugars: recipe.totalNutrients.SUGAR.quantity,
      protein: recipe.totalNutrients.PROCNT.quantity,
      cholesterol: recipe.totalNutrients.CHOLE.quantity,
      sodium: recipe.totalNutrients.NA.quantity,
      calcium: recipe.totalNutrients.CA.quantity,
      magnesium: recipe.totalNutrients.MG.quantity,
      potassium: recipe.totalNutrients.K.quantity,
      iron: recipe.totalNutrients.FE.quantity,
      zinc: recipe.totalNutrients.ZN.quantity,
    },
    defaultServing: {
      name: 'gram',
      weight: 100,
    },
    isPopular: true,
  });
  console.log(newRecipe, 'New recipe here');
});

const importFood = async (products) => {
  try {
    await Promise.all(
      products.map(async (product) => {
        await createNewFood(product);
      })
    );
  } catch (err) {
    console.log(err);
  }
  console.log('Food is getting loaded');
  //process.exit();
};

const deleteFood = async () => {
  try {
    await Food.deleteMany();
    console.log('Food successfuly deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const importRecipe = async (recipes) => {
  try {
    await Promise.all(
      recipes.map(async (recipe) => {
        await createNewRecipe(recipe);
      })
    );
  } catch (err) {
    console.log(err);
  }
  console.log('Recipes are getting loaded');
  //process.exit();
};

const deleteRecipe = async () => {
  try {
    await Recipe.deleteMany();
    console.log('Recipes successfuly deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--importFood') {
  const basicProducts = [
    'Chocolate',
    'egg',
    'peanut butter',
    'oil',
    'chicken',
    'milk',
    'cucumber',
    'tomato',
    'cheese',
    'rice',
    'salmon',
    'fish',
    'pizza',
    'oatmeal',
    'yogurt',
    'apple',
    'bread',
    'ice cream',
    'carrot',
    'candy',
    'cookie',
  ];
  importFood(basicProducts);
} else if (process.argv[2] === '--deleteFood') {
  deleteFood();
} else if (process.argv[2] === '--importRecipe') {
  const basicRecipes = [
    'salmon',
    'pasta',
    'chicken',
    'pizza',
    'cream cheese cake',
  ];
  importRecipe(basicRecipes);
} else if (process.argv[2] === '--deleteRecipe') {
  deleteRecipe();
}
// TODO: ix it and add process.exit() after all the foods are created