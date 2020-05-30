const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const AuthorError = require('../errors/AuthorizationError');
const UserExistsError = require('../errors/user-exists-err');

const { JWT_SECRET, messages } = require('../config');

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .orFail(new AuthorError(messages.wrongUserPassword))
    .select('+password')
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) throw new AuthorError(messages.wrongUserPassword);
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', token, { maxAge: 604800000, httpOnly: true });
        return res.send(token);
      }))
    .catch(next);
};

const findUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(messages.wrongId))
    .then((user) => {
      res.status(200).send({ name: user.name, email: user.email });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }, (err, user) => {
      if (err) next(new UserExistsError(messages.userExists));
      else {
        res.send({
          data: {
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          },
        });
      }
    }))
    .catch(next);
};

module.exports = {
  findUser, createUser, login,
};
