const express = require('express');
const recipeController = require('../controllers/recipeController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/top-10-high-protein')
  .get(recipeController.aliasTopProteinRecipes, recipeController.getAllRecipes);

router.get('/myRecipes', authController.protect, recipeController.getMyRecipes);

router
  .route('/')
  .get(recipeController.getAllRecipes)
  .post(authController.protect, recipeController.createRecipe);

router
  .route('/:id')
  .get(recipeController.getRecipe)
  .patch(
    authController.protect,
    recipeController.isRecipeCreator,
    recipeController.updateRecipe
  )
  .delete(
    authController.protect,
    recipeController.isRecipeCreator,
    recipeController.deleteRecipe
  );

module.exports = router;
