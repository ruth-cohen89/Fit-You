const express = require('express');
const morgan = require('morgan');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const programRouter = require('./routes/programRoutes');
const mealRouter = require('./routes/mealRoutes');
const foodRouter = require('./routes/foodRoutes');
const recipeRouter = require('./routes/recipeRoutes');
const shoppingListRouter = require('./routes/shoppingListRoutes');
const workoutRouter = require('./routes/workoutRoutes');

const app = express();

app.enable('trust proxy');

// Access-Control-Allow-Origin *
// app.use(cors());
// app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));

// eslint-disable-next-line prefer-arrow-callback
app.get('/api', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/welcome.html'));
});

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use('/api', limiter);
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// eslint-disable-next-line prefer-arrow-callback
// app.get('/api', function (req, res) {
//   res.sendFile(path.join(__dirname, '/public/welcome.html'));
// });

app.use('/api/v1/users', userRouter);
app.use('/api/v1/programs', programRouter);
app.use('/api/v1/meals', mealRouter);
app.use('/api/v1/foods', foodRouter);
app.use('/api/v1/recipes', recipeRouter);
app.use('/api/v1/shoppingLists', shoppingListRouter);
app.use('/api/v1/workouts', workoutRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;

// sudo vim /etc/systemd/system/fitYou.service
// sudo systemctl enable fityou.service
// sudo systemctl start fityou.service