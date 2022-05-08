const express = require('express');
const mealController = require('../controllers/mealController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/:id/foods/:foodId')
  .delete(authController.protect, mealController.deleteFoodFromMeal);

router
  .route('/:programId/week')
  .get(authController.protect, mealController.getWeeklyMealPlan);

router
  .route('/:programId/:day')
  .get(authController.protect, mealController.getDailyMealPlan);

router
  .route('/')
  .post(authController.protect, mealController.createMeal)
  .get(mealController.getAllMeals);

router
  .route('/:id')
  .get(mealController.getMeal)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    mealController.updateMeal
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    mealController.deleteMeal
  );

module.exports = router;
