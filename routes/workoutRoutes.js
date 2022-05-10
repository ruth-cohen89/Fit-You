const express = require('express');
const workoutController = require('../controllers/workoutController');
const authController = require('../controllers/authController');
const programController = require('../controllers/programController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/:programId/week').get(workoutController.getWeeklyWorkoutPlan);
router.route('/:programId/:day').get(workoutController.getDailyWorkout);

router
  .route('/')
  .get(authController.restrictTo('admin'), workoutController.getAllWorkouts)
  .post(programController.setProgramIdForUser, workoutController.createWorkout);

router
  .route('/:id')
  .get(workoutController.getWorkout)
  .patch(workoutController.updateWorkout)
  .delete(workoutController.deleteWorkout);

module.exports = router;
