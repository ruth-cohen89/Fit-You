const express = require('express');
const exerciseController = require('../controllers/exerciseController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(exerciseController.getAllExercises)
  .post(authController.protect, exerciseController.createExercise);

router
  .route('/:id')
  .get(exerciseController.getExercise)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    exerciseController.updateExercise
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    exerciseController.deleteExercise
  );

module.exports = router;
