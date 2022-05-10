const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    unique: true,
    required: [true, 'Shopping list must belong to a user'],
  },
  products: [
    {
      //food id?
      name: {
        type: String,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
});

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);
module.exports = ShoppingList;
