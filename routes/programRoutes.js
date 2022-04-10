const express = require('express');
const programController = require('../controllers/programController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(authController.protect, programController.createProgram)
  .get(authController.restrictTo('admin'), programController.getAllPrograms);

router.route('/:id').get(programController.getProgram);

module.exports = router;
