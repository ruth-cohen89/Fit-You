const ShoppingList = require('../models/shoppingListModel');
//const AppError = require('../utils/appError');
//const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createShoppingList = factory.createOne(ShoppingList);
exports.getAllShoppingLists = factory.getAll(ShoppingList);
exports.getShoppingList = factory.getOne(ShoppingList);
exports.updateShoppingList = factory.updateOne(ShoppingList);
exports.deleteShoppingList = factory.deleteOne(ShoppingList);
