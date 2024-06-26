const express = require('express');
const articlesRouter = express.Router();
const {
  getArticleById,
  getArticles,
  getCommentByArticleId,
  postCommentByArticleId,
  patchVoteByArticleId,
  postArticle,
  deleteArticleById,
} = require('../controllers/articles-controllers');

articlesRouter.get(`/`, getArticles);
articlesRouter.get(`/:article_id`, getArticleById);
articlesRouter.get(`/:article_id/comments`, getCommentByArticleId);
articlesRouter.post(`/:article_id/comments`, postCommentByArticleId);
articlesRouter.patch(`/:article_id`, patchVoteByArticleId);
articlesRouter.post(`/`, postArticle);
articlesRouter.delete(`/:article_id`, deleteArticleById);

articlesRouter.use((err, req, res, next) => {
  if (err.code === '23503') {
    res.status(400).send({ msg: 'user does not exist' });
  } else {
    next(err);
  }
});

module.exports = articlesRouter;
