const express = require('express');
const programController = require('../controllers/programController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const mealRouter = require('./mealRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:programId/meals', mealRouter); // TODO: ? or in programRoutes

router.use(authController.protect);

router
  .route('/createMyProgram')
  .post(userController.addUserIdToBody, programController.createProgram);

router.get('/myProgram', programController.getMyProgram);
router.patch('/updateMyProgram', programController.updateMyProgram);

router.use(authController.restrictTo('admin'));
// only admin can delete program
router
  .route('/:id')
  .get(programController.getProgram)
  .patch(programController.updateProgram)
  .delete(programController.deleteProgram);

router
  .route('/')
  .post(programController.createProgram)
  .get(programController.getAllPrograms);

module.exports = router;
