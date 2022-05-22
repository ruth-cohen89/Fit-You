const express = require('express');
const mealController = require('../controllers/mealController');
const authController = require('../controllers/authController');
const programController = require('../controllers/programController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/:programId/recentlyUsedItems')
  .get(mealController.getRecentlyUsedItems);

router.route('/:id/foods/:foodId').delete(mealController.deleteFoodFromMeal);
router.route('/:programId/week').get(mealController.getWeeklyMealPlan);

router
  .route('/:programId/:day')
  .get(mealController.getDailyMealPlan)
  .delete(mealController.clearMealPlanDay);

router
  .route('/')
  .post(programController.setProgramIdForUser, mealController.createMeal)
  .get(authController.restrictTo('admin'), mealController.getAllMeals);

router
  .route('/:id')
  .get(mealController.getMeal)
  .patch(mealController.updateMeal)
  .delete(mealController.deleteMeal);

module.exports = router;
