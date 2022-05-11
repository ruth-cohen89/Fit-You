const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Shopping list must belong to a user'],
  },
  name: {
    type: String,
    unique: true,
    required: [true, 'Please give your list a name'],
  },
  products: [
    {
      name: {
        type: String,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);
module.exports = ShoppingList;
