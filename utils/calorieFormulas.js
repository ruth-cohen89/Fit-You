// 15-80
let age = 22;
let gender = 'female';
// 135 - 2.5
let height = 149; // cm
let currentWeight = 50; // kg
let targetWeight = 47; 
let timeToLoseWeight = 14; // days
const weightToLose = targetWeight - currentWeight;

// 1-5
// activity: 1-5
let activity = 2;

let factor;
if (activity === 1) {
  factor = 1.2;
} else if (activity === 2) {
  factor = 1.375;
} else if (activity === 3) {
  factor = 1.55;
} else if (activity === 4) {
  factor = 1.725;
} else if (activity === 5) {
  factor = 1.9;
}

//9.247 * weight  + 3.098 * height - 4.330 * age + 447.593;
// Female BMR = 10W + 6.25H - 5A - 161
// Male BMR = 10W + 6.25H - 5A + 5
let BMR;
if (gender === 'female') {
  BMR = 10 * weight + 6.25 * height - 5 * age - 161;
} else if (gender === 'male') {
  BMR = 10 * weight + 6.25 * height - 5 * age + 5;
} else {
  throw new Error('Gender is not valid')
}

const TDEE = Math.round(BMR * factor);

const kgFat = 7700; // cals
const caloriesOfFatToLose = kgFat * weightToLose;
const dailyDeficit = caloriesOfFatToLose / timeToLoseWeight;
const dailyCaloriesToConsume = TDEE - dailyDeficit;


if (
  dailyDeficit > 1000 ||
  (gender === 'man' && dailyCaloriesToConsume < 1600) ||
  (gender === 'woman' && dailyCaloriesToConsume < 1000)
) {
  throw new Error('Too few calories per day, Please extend end time');
}

const message = `You need to consume ${dailyCaloriesToConsume} every day to reach your goal!`;
console.log(message);
// If dailyDeficit is bigger than 1000 - losing more than 2lb for a week
// If dailyDeficit...
// 7700/14=550
// 1 lb of fat = 3,500
// 1 kg of fat = 7700 cals
// 1 kg = 2.2 lbs
// 7700/3500 = 2.2
// reccomended deficit = 250-500
// reccomended weight loss: 1-2 pounds per week