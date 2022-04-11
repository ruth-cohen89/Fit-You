const express = require('express');
const mealController = require('../controllers/mealController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// router
//   .route('/')
//   .post(authController.protect, mealController.createMeal)
//   .get(mealController.getAllmeals);

// router
//   .route('/:id')
//   .get(mealController.getMeal);
//   .patch(
//     mealController.protect,
//     mealController.restrictTo('admin'),
//     mealController.updateMeal
//   );
//   .delete(
//     mealController.protect,
//     mealController.restrictTo('admin'),
//     mealController.deleteMeal
//   );

module.exports = router;
