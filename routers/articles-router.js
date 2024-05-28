const express = require('express');
const articlesRouter = express.Router();
const { getArticleById } = require('../controllers/articles-controllers');

articlesRouter.get(`/:article_id`, getArticleById);

articlesRouter.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
  } else {
    next(err);
  }
});

articlesRouter.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

articlesRouter.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Something went really wrong' });
});

module.exports = articlesRouter;
