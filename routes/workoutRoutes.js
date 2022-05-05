const express = require('express');
const workoutController = require('../controllers/workoutController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(workoutController.getAllWorkouts)
  .post(authController.protect, workoutController.createWorkout);

router
  .route('/:id')
  .get(workoutController.getWorkout)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    workoutController.updateWorkout
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    workoutController.deleteWorkout
  );

module.exports = router;
