const express = require('express');
const shoppingListController = require('../controllers/shoppingListController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/createMyShoppingList')
  .post(
    userController.addUserIdToBody,
    shoppingListController.createShoppingList
  );

router
  .route('/GetAllMyShoppingLists')
  .get(
    userController.addUserIdToParams,
    shoppingListController.getAllShoppingLists
  );

router
  .route('/')
  .get(
    authController.restrictTo('admin'),
    shoppingListController.getAllShoppingLists
  )
  .post(shoppingListController.createShoppingList);

router
  .route('/:id')
  .get(shoppingListController.getShoppingList)
  .patch(shoppingListController.updateShoppingList)
  .delete(shoppingListController.deleteShoppingList);

module.exports = router;
