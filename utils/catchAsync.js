// Wrapper for catching rejections
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
