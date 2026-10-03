const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const fetch = require('node-fetch');
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

// DB-first lookup: reuse a shared food already stored locally. If it does not
// exist, fetch it once from EDAMAM, persist it, and reuse it on later searches.
exports.lookupFood = catchAsync(async (req, res, next) => {
  const query = String(req.query.q || '').trim();

  if (!query) {
    return next(new AppError('Please provide a food query using ?q=', 400));
  }

  const normalizedName = query.toLowerCase();

  let food = await Food.findOne({
    normalizedName,
    user: { $exists: false },
  });

  // Backwards compatibility for foods imported before normalizedName existed.
  if (!food) {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    food = await Food.findOne({
      name: { $regex: `^${escapedQuery}$`, $options: 'i' },
      user: { $exists: false },
    });

    if (food && !food.normalizedName) {
      food.normalizedName = normalizedName;
      await food.save();
    }
  }

  if (food) {
    return res.status(200).json({
      status: 'success',
      source: 'database',
      data: { data: food },
    });
  }

  const params = new URLSearchParams({
    app_id: process.env.EDAMAM_FOOD_APPID,
    app_key: process.env.EDAMAM_FOOD_APPKEY,
    ingr: query,
    'nutrition-type': 'cooking',
    category: 'generic-foods',
  });

  const response = await fetch(
    `https://api.edamam.com/api/food-database/v2/parser?${params.toString()}`
  );

  if (!response.ok) {
    return next(new AppError('Could not fetch food data from EDAMAM.', 502));
  }

  const data = await response.json();

  if (!data.parsed || data.parsed.length === 0) {
    return next(new AppError('Food was not found.', 404));
  }

  const edamamFood = data.parsed[0].food;
  const foodMeasures = data.hints?.[0]?.measures || [];
  const measures = foodMeasures.map((serving) => ({
    type: serving.label,
    weight: serving.weight,
  }));

  food = await Food.create({
    name: edamamFood.label,
    normalizedName,
    totalWeight: 100,
    nutrients: {
      calories: edamamFood.nutrients.ENERC_KCAL,
      protein: edamamFood.nutrients.PROCNT,
      fat: edamamFood.nutrients.FAT,
      carbs: edamamFood.nutrients.CHOCDF,
      fiber: edamamFood.nutrients.FIBTG,
    },
    measures,
    image: edamamFood.image,
    isPopular: false,
  });

  return res.status(200).json({
    status: 'success',
    source: 'edamam',
    data: { data: food },
  });
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
