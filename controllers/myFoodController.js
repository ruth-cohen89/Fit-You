const MyFood = require('../models/myFoodModel');
const factory = require('./handlerFactory');

exports.createMyFood = factory.createOne(MyFood);
exports.getAllMyFoods = factory.getAll(MyFood);
exports.getMyFood = factory.getOne(MyFood);
exports.updateMyFood = factory.updateOne(MyFood);
exports.deleteMyFood = factory.deleteOne(MyFood);