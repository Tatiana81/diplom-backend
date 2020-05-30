const express = require('express');
const { errors, celebrate, Joi } = require('celebrate');
const users = require('./users');
const articles = require('./articles');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { createUser, login } = require('../controllers/users');
const { messages } = require('../config');

const { requestLogger, errorLogger } = require('../middlewares/logger');

const router = express.Router();

router
  .use(requestLogger)
  .post('/signin', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }), login)
  .post('/signup', celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }), createUser)
  .use('/articles', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string().length(172),
    }).unknown(true),
  }), auth, articles)
  .use('/users', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string().length(172),
    }).unknown(true),
  }), auth, users)
  .use('*', (req, res, next) => {
    next(new NotFoundError(messages.resourceNotFound));
  })
  .use(errorLogger)
  .use(errors())
  .use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? messages.serverError
          : message,
      });
  });

module.exports = router;
