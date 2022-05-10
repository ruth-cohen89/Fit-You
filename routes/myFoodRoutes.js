const express = require('express');
const myFoodController = require('../controllers/myFoodController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
router.use(authController.protect);

router
  .route('/')
  .get(myFoodController.getAllMyFoods)
  .post(myFoodController.createMyFood);

router
  .route('/:id')
  .get(myFoodController.getMyFood)
  .patch(myFoodController.updateMyFood)
  .delete(myFoodController.deleteMyFood);

module.exports = router;
