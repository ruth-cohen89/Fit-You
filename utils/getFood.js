const fetch = require('node-fetch');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const catchAsync = require('./catchAsync');
const Food = require('../models/foodModel');
// const { crossOriginResourcePolicy } = require('helmet');

dotenv.config({ path: './config.env' });
//node ./utils/getFood.js --import

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('Connected to DB 🙂'));

const requestFood = catchAsync(async (ingr) => {
  console.log(ingr)
  const apiUr = `https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.EDAMAM_APPID}&app_key=${process.env.EDAMAM_APPKEY}&ingr=chocolate&nutrition-type=cooking&category=generic-foods`;
  const apiUrl =
    'https://api.edamam.com/api/food-database/v2/parser?app_id=df5d4e31&app_key=28e85d3b17176dbda832b17f8c436c05&ingr=chocolate&nutrition-type=cooking&category=generic-foods';
  console.log('b')
  const response = await fetch(apiUrl);
  console.log(response);
  const data = await response.json();

  return data;

  //const firstData = data.parsed[0];
  //console.log(data.parsed[0]);
});
requestFood();
const createNewFood = catchAsync(async (data) => {
  const newFood = Food.create({ id: data.foodId });
  newFood.name = data.label;
  newFood.foodId = data.foodId;
  newFood.calories = data.nutrients.ENERC_KCAL;
  newFood.protein = data.nutrients.PROCNT;
  newFood.fat = data.nutrients.FAT;
  newFood.carbs = data.nutrients.CHOCDF;
  newFood.fiber = data.nutrients.FIBTG;
  newFood.image = data.image;
  console.log(newFood);
});

const importFood = async () => {
  requestFood();
  try {
    
    const basicProducts = [
      'Chocolate',
      'milk',
      'cucumber',
      'tomato',
      'pepper',

    ];
    // 'orange',
    // 'salmon',
    // 'fish',
    // 'dennis',
    // 'oatmeal',
    // 'apple',
    // 'yogurt',
    // 'bread',
    // 'pita',
    // 'cheese',
    // 'bamba',
    // 'candy',
    let data = '';
    // eslint-disable-next-line no-plusplus
    //for (let i = 0; i < basicProducts.length; i++) {
      data = requestFood(basicProducts[0]);
      //createNewFood(data.firstData.food);
    //}
    console.log('Food successfuly loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
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
requestFood();
//if (process.argv[2] === '--import') {
//   requestFood();
//   importFood();
// } else if (process.argv[2] === '--delete') {
//   deleteFood();
// }

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
