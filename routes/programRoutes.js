const express = require('express');
const programController = require('../controllers/programController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .post(programController.createProgram)
  .get(authController.restrictTo('admin'), programController.getAllPrograms);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);
  
router.use(authController.restrictTo('admin'));

router
  .route('/:id')
  .get(programController.getProgram)
  .patch(programController.updateProgram)
  .delete(programController.deleteProgram);

module.exports = router;
