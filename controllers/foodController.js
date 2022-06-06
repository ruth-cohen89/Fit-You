const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const Food = require('../models/foodModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

// eslint-disable-next-line no-new
const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
});

const upload = (bucketName) =>
  multer({
    storage: multerS3({
      s3,
      bucket: bucketName,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, `foods/image-${Date.now()}.jpeg`);
      },
    }),
  });

exports.setFoodPic = (req, res, next) => {
  const uploadSingle = upload('fityou-images').single('photo');

  uploadSingle(req, res, async (err) => {
    if (err)
      return res.status(400).json({ success: false, message: err.message });
    req.body = JSON.parse(req.body.data);
    next();
  });
};

exports.aliasTopProteinFoods = catchAsync(async (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-proteinCalorieRatio';
  req.query.fields =
    'name,proteinCalorieRatio,nutrients.protein,nutrients.calories';
  next();
});

exports.getMyFoods = catchAsync(async (req, res, next) => {
  const foods = await Food.find({ user: req.user._id });
  if (foods.length === 0) {
    return next(new AppError('User has not created any foods.', 400));
  }

  res.status(200).json({
    status: 'success',
    results: foods.length,
    data: {
      data: foods,
    },
  });
});

exports.isFoodCreator = catchAsync(async (req, res, next) => {
  const food = await Food.findById(req.params.id);

  if (String(food.user) !== String(req.user._id) && req.user.role !== 'admin') {
    return next(
      new AppError(
        'Food was not created by this user! User cant make any changes.',
        400
      )
    );
  }
  next();
});

exports.createFood = factory.createOne(Food);
exports.getAllFoods = factory.getAll(Food);
exports.getFood = factory.getOne(Food);
exports.updateFood = factory.updateOne(Food);
exports.deleteFood = factory.deleteOne(Food);
