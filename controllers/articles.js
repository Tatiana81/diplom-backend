const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const PermissionError = require('../errors/permission-error');
const { messages } = require('../config');

const getArticles = (req, res, next) => {
  Article
    .find({ owner: req.user._id })
    .orFail(new NotFoundError(messages.noArticle))
    .then((article) => res.send({ data: article }))
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .orFail(new NotFoundError(messages.wrongId))
    .then((article) => {
      if (!article.owner.equals(req.user._id)) throw new PermissionError(messages.permissionDenied);
      return Article.deleteOne(article)
        .then(() => res.send({ data: article }));
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    owner: req.user._id, keyword, title, text, date, source, link, image,
  })
    .then((article) => res.send({ data: article }))
    .catch(next);
};

module.exports = { getArticles, deleteArticle, createArticle };
