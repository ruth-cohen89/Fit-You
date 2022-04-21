const express = require('express');
const foodController = require('../controllers/foodController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
// router.use();

router
  .route('/top-10-foods')
  .get(foodController.aliasTopFoods, foodController.getAllFoods);

router
  .route('/')
  .get(foodController.getAllFoods)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    foodController.createFood
  );

router
  .route('/:id')
  .get(foodController.getFood)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    foodController.updateFood
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    foodController.deleteFood
  );

module.exports = router;
