const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const client = require('twilio')(
  process.env.TWILLO_ACCOUNT_SID,
  process.env.TWILLO_AUTH_TOKEN
);
const User = require('../models/userModel');
const RefreshToken = require('../models/refreshTokenModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = async (user, statusCode, req, res) => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = await RefreshToken.createToken(user);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 //days to ms
    ),
    httpOnly: true,
    secure: req.secure || req.headers('x-forwarded-proto') === 'https',
  };

  res.cookie('jwt', accessToken, refreshToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    refreshToken,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // 1) Create user data
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    // false until user confirms his email address
    emailConfirmed: false,
  });

  const confirmToken = newUser.createEmailConfirmToken();
  await newUser.save({ validateBeforeSave: false });
  const confirmURL = `${req.protocol}://${req.get(
    'host'
  )}/emailConfirm/${confirmToken}`;
  await new Email(newUser, confirmURL).sendWelcome();
  res.status(200).json({
    status: 'success',
    message: 'Confimiration email successfuly sent to your address',
    data: {
      newUser,
    },
  });
});

exports.emailConfirm = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    confirmEmailToken: hashedToken,
    confirmEmailExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.emailConfirmed = true;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });
  createSendToken(user, 200, req, res);
});

exports.sendSmsVerificationCode = catchAsync(async (req, res, next) => {
  const result = await client.verify
    .services(process.env.TWILLO_SERVICE_SID)
    .verifications.create({
      to: `+${req.query.phoneNumber}`,
      channel: req.query.channel,
    });
  if (!result) {
    return next(new AppError('Problem sending sms', 400));
  }
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

exports.verifySmsCode = catchAsync(async (req, res, next) => {
  const result = await client.verify
    .services(process.env.TWILLO_SERVICE_SID)
    .verificationChecks.create({
      to: `+${req.query.phoneNumber}`,
      code: req.query.code,
    });
  if (!result) {
    return next(new AppError('Problem veryfing user', 400));
  }
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password emailConfirmed');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Inncorrect email or password', 401));
  }
  if (!user.emailConfirmed) {
    return next(
      new AppError('You have not confirmed your email address!', 401)
    );
  }
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return next(new AppError('Refresh Token is required!', 403));
  }
  const refreshToken = await RefreshToken.findOne({ token: requestToken });
  if (!refreshToken) {
    return next(new AppError('Refresh token is not in database!', 403));
  }

  if (RefreshToken.verifyExpiration(refreshToken)) {
    RefreshToken.findByIdAndRemove(refreshToken._id, {
      useFindAndModify: false,
    }).exec();
    return next(
      new AppError(
        'Refresh token was expired. Please make a new signin request',
        403
      )
    );
  }

  RefreshToken.findByIdAndRemove(refreshToken._id, {
    useFindAndModify: false,
  }).exec();
  const newAccessToken = signAccessToken(refreshToken.user._id);
  const newRefreshToken = await RefreshToken.createToken(refreshToken.user._id);
  res.cookie('jwt', newAccessToken, {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.cookie('refreshToken', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'New access and refresh tokens.',
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

// Authentication
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // postman
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    // browser
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token || token === 'null') {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

// Authorization
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong!', 401)); //401, unauthorized
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, res);
});
