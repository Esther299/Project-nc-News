const {
  selectArticleById,
  selectAllArticles,
  checkArticleExists,
  selectCommentByArticleId,
  createCommentByArticleId,
  updateVotesByArticleId,
  createArticle,
} = require('../models/articles-models');
const { checkTopicExists } = require('../models/topics-models');

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order_by } = req.query;
  selectAllArticles(topic, sort_by, order_by)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const promises = [selectCommentByArticleId(article_id)];

  if (article_id) {
    promises.push(checkArticleExists(article_id));
  }

  Promise.all(promises)
    .then((result) => {
      const comments = result[0];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { author, body } = req.body;
  const { article_id } = req.params;

  checkArticleExists(article_id)
    .then(() => {
      return createCommentByArticleId(article_id, author, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVoteByArticleId = (req, res, next) => {
  const newVote = req.body;
  const { article_id } = req.params;
  checkArticleExists(article_id)
    .then(() => {
      return updateVotesByArticleId(article_id, newVote);
    })
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;
  const imageUrl = article_img_url || 'https://picsum.photos/200/300?grayscale';
  checkTopicExists(topic)
    .then(() => {
      return createArticle(author, title, body, topic, imageUrl);
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
