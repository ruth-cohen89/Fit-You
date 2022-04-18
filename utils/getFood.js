const fetch = require('node-fetch');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const catchAsync = require('./catchAsync');
const Food = require('../models/foodModel');
// const { crossOriginResourcePolicy } = require('helmet');

dotenv.config({ path: './config.env' });
//node ./utils/getFood.js --import

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

const requestFood = catchAsync(async () => {
  const apiUrl =
    'https://api.edamam.com/api/food-database/v2/parser?app_id=df5d4e31&app_key=28e85d3b17176dbda832b17f8c436c05&ingr=chocolate&nutrition-type=cooking&category=generic-foods';

  //const firstData = data.parsed[0];
  //console.log(data.parsed[0]);
});

const createNewFood = catchAsync(async (ingr) => {
  console.log(ingr)
  const apiUri = `https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.EDAMAM_APPID}&app_key=${process.env.EDAMAM_APPKEY}&ingr=${ingr}&nutrition-type=cooking&category=generic-foods`;
  const response = await fetch(apiUri);
  const data = await response.json();
  //console.log(data, 'ma');
  // eslint-disable-next-line prefer-destructuring
  console.log(data)
  const food = data.parsed[0].food;
  console.log(food);
  const newFood = await Food.create({
    id: food.foodId,
    name: food.label,
    foodId: food.foodId,

    nutrients: {
      calories: food.nutrients.ENERC_KCAL,
      protein: food.nutrients.PROCNT,
      fat: food.nutrients.FAT,
      carbs: food.nutrients.CHOCDF,
      fiber: food.nutrients.FIBTG,
    },
    image: food.image,
  });
  console.log(newFood, 'new food here');
});

const importFood = async () => {
  try {
    const basicProducts = [
      'Chocolate',
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
    const promises = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < basicProducts.length; i++) {
      promises.push(createNewFood(basicProducts[i]));
    }
    // eslint-disable-next-line no-restricted-syntax
    //for (const e of basicProducts) {
    // eslint-disable-next-line no-await-in-loop
    // await createNewFood(e);
    //}
  } catch (err) {
    console.log(err);
  }
  console.log('Food successfuly loaded');
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
  importFood();
} else if (process.argv[2] === '--delete') {
  deleteFood();
}

// exports.searchFood = catchAsync(async (req, res, next) => {
//   const { ingr } = req.body;
//   const response = await fetch(apiUrl);
//   const data = await response.json();
//   const firstData = data.parsed[0];
//   console.log(data.parsed[0]);
// }); let the user send a request to search food?

//getIt();
//fetch(apiUrl).then((response) => response.json());
//  nutrients: {
//getFood().then((data) => console.log(data));
