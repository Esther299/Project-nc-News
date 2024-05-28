const express = require('express');
const articlesRouter = express.Router();
const {
  getArticleById,
  getArticles,
  getCommentByArticleId,
} = require('../controllers/articles-controllers');

articlesRouter.get(`/`, getArticles);
articlesRouter.get(`/:article_id`, getArticleById);
articlesRouter.get(`/:article_id/comments`, getCommentByArticleId);

module.exports = articlesRouter;
