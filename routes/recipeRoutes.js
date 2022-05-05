const express = require('express');
const recipeController = require('../controllers/recipeController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/top-10-recipes')
  .get(recipeController.aliasTopRecipes, recipeController.getAllRecipes);

router
  .route('/')
  .get(recipeController.getAllRecipes)
  .post(authController.protect, recipeController.createRecipe);

router
  .route('/:id')
  .get(recipeController.getRecipe)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    recipeController.updateRecipe
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    recipeController.deleteRecipe
  );

module.exports = router;
