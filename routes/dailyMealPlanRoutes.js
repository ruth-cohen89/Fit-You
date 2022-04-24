const express = require('express');
const mealPlanController = require('../controllers/dailyMealPlanController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protect,
    mealPlanController.checkDailyMacros,
    mealPlanController.createMealPlan
  )
  .get(mealPlanController.getAllMealPlans);

router
  .route('/:id')
  .get(mealPlanController.getMealPlan)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    mealPlanController.updateMealPlan
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    mealPlanController.deleteMealPlan
  );

module.exports = router;
