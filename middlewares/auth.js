const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  const { cookies } = req;
  const authorization = cookies.jwt;
  if (!authorization) {
    return next(new AuthorizationError('Необходима авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(authorization, JWT_SECRET);
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация'));
  }
  req.user = payload;
  next();
  return req.user;
};
