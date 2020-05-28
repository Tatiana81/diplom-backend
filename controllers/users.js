const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const AuthorError = require('../errors/AuthorizationError');

const { JWT_SECRET } = require('../config');

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .orFail(new AuthorError('Неправильные почта или пароль'))
    .select('+password')
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) throw new AuthorError('Неправильные почта или пароль');
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', token, { maxAge: 604800000, httpOnly: true });
        return res.send(token);
      }))
    .catch(next);
};

const findUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      },
    }))
    .catch(next);
};

module.exports = {
  findUser, createUser, login,
};
