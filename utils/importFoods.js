const fetch = require('node-fetch');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const catchAsync = require('./catchAsync');
const Food = require('../models/foodModel');

//node ./utils/importFoods.js --import delete
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
  const apiUri = `https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.EDAMAM_APPID}&app_key=${process.env.EDAMAM_APPKEY}&ingr=${ingr}&nutrition-type=cooking&category=generic-foods`;
  const response = await fetch(apiUri);
  const data = await response.json();

  // eslint-disable-next-line prefer-destructuring
  const food = data.parsed[0].food;
  const foodMeasures = data.hints[0].measures;
  const filteredMeasures = foodMeasures.map((measure) => ({
    name: measure.label,
    weight: measure.weight,
  }));
  const newFood = await Food.create({
    name: food.label,
    //foodId: food.foodId,

    nutrients: {
      calories: food.nutrients.ENERC_KCAL,
      protein: food.nutrients.PROCNT,
      fat: food.nutrients.FAT,
      carbs: food.nutrients.CHOCDF,
      fiber: food.nutrients.FIBTG,
    },

    defaultServing: {
      name: 'gram',
      weight: 100,
    },
    measures: filteredMeasures,
    image: food.image,
  });
  console.log(newFood, 'New food here');
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

if (process.argv[2] === '--import') {
  const basicProducts = [
    'Chocolate',
    'egg',
    'peanut butter',
    'matza',
    'marshmallow',
    'milk',
    'cucumber',
    'tomato',
    'pepper',
    'orange',
    'salmon',
    'fish',
    'pizza',
    'oatmeal',
    'yogurt',
    'apple',
    'bread',
    'pita',
    'cheese',
    'candy',
  ];
  importFood(basicProducts);
} else if (process.argv[2] === '--delete') {
  deleteFood();
}

//hi();
// exports.searchFood = catchAsync(async (req, res, next) => {
//   const { ingr } = req.body;
//   const response = await fetch(apiUrl);
//   const data = await response.json();
//   const firstData = data.parsed[0];
//   console.log(data.parsed[0]);
// }); let the user send a request to search food?

//getFood().then((data) => console.log(data));
// eslint-disable-next-line no-plusplus
// for (let i = 0; i < basicProducts.length; i++) {
//   // eslint-disable-next-line no-await-in-loop
//   await createNewFood(basicProducts[i]);
// }
//node ./utils/getFood.js --import
// eslint-disable-next-line no-restricted-syntax
//for (const e of basicProducts) {
// eslint-disable-next-line no-await-in-loop
// await createNewFood(e);
//}
// const { crossOriginResourcePolicy } = require('helmet');
//  //console.log(ingr);
// TODO: ix it and add process.exit() after all the foods are created
