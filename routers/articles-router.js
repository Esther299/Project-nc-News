const express = require('express');
const articlesRouter = express.Router();
const { getArticleById, getArticles } = require('../controllers/articles-controllers');

articlesRouter.get(`/`, getArticles);
articlesRouter.get(`/:article_id`, getArticleById);


module.exports = articlesRouter;
