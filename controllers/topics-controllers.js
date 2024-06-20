const { selectAllTopics, createTopic } = require('../models/topics-models');

exports.getTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopics = (req, res, next) => {
  const { slug, description } = req.body;
  createTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};