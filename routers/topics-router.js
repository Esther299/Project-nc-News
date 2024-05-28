const express = require('express');
const topicsRouter = express.Router();
const { getTopics } = require('../controllers/topics-controllers');

topicsRouter.get(`/`, getTopics);

topicsRouter.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
  } else {
    next(err);
  }
});

topicsRouter.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

topicsRouter.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Something went really wrong' });
});

module.exports = topicsRouter;

