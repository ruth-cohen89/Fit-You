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

const requestFood = catchAsync(async () => {
  const apiUrl =
    'https://api.edamam.com/api/food-database/v2/parser?app_id=df5d4e31&app_key=28e85d3b17176dbda832b17f8c436c05&ingr=chocolate&nutrition-type=cooking&category=generic-foods';

  //const firstData = data.parsed[0];
  //console.log(data.parsed[0]);
});

const createNewFood = catchAsync(async (ingr) => {
  const apiUri = `https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.EDAMAM_APPID}&app_key=${process.env.EDAMAM_APPKEY}&ingr=${ingr}&nutrition-type=cooking&category=generic-foods`;
  const response = await fetch(apiUri);
  const data = await response.json();
  console.log(data, 'ma');
  const newFood = await Food.create({
    id: data.foodId,
    name: data.label,
    foodId: data.foodId,
    calories: data.nutrients.ENERC_KCAL,
    protein: data.nutrients.PROCNT,
    fat: data.nutrients.FAT,
    carbs: data.nutrients.CHOCDF,
    fiber: data.nutrients.FIBTG,
    image: data.image,
  });
  console.log(newFood, 'new food here');
});

const importFood = async () => {
  try {
    const basicProducts = ['Chocolate', 'milk', 'cucumber', 'tomato', 'pepper'];
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
    // let data = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < basicProducts.length; i++) {
      createNewFood(basicProducts[i]);
    }
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
importFood();

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
