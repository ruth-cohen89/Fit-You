const express = require('express');
const shoppingListController = require('../controllers/shoppingListController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

//TODO: לוודא שכל ה CRUD עובד
router
  .route('/createMyShoppingList')
  .post(
    userController.addUserIdToBody,
    shoppingListController.createShoppingList
  );

router
  .route('/GetMyShoppingList')
  .get(
    shoppingListController.getMyShoppingList,
    shoppingListController.getShoppingList
  );

router
  .route('/')
  .get(
    authController.restrictTo('admin'),
    shoppingListController.getAllShoppingLists
  )
  .post(authController.protect, shoppingListController.createShoppingList);

router
  .route('/:id')
  .get(shoppingListController.getShoppingList)
  .patch(authController.protect, shoppingListController.updateShoppingList)
  .delete(authController.protect, shoppingListController.deleteShoppingList);

module.exports = router;
