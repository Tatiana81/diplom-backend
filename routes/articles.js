const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const { getArticles, deleteArticle, createArticle } = require('../controllers/articles');

router
  .get('/', getArticles)
  .post('/', celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().uri(),
      image: Joi.string().required().uri(),
    }),
  }), auth, createArticle)
  .delete('/:articleId', celebrate({
    params: Joi.object().keys({
      articleId: Joi.string().alphanum().length(24),
    }),
  }), auth, deleteArticle);

module.exports = router;
