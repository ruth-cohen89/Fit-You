const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const refreshTokensSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  token: String,
  expiryDate: Date,
});
refreshTokensSchema.statics.createToken = async function (user) {
  const expiredAt = new Date();
  expiredAt.setSeconds(
    expiredAt.getSeconds() + process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
  );
  const _token = uuidv4();
  const _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });
  const refreshToken = await _object.save();
  return refreshToken.token;
};

refreshTokensSchema.statics.verifyExpiration = (token) =>
  token.expiryDate.getSeconds() < new Date().getSeconds();

const RefreshToken = mongoose.model('RefreshToken', refreshTokensSchema);
module.exports = RefreshToken;
