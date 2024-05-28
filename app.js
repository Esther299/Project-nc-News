const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');

const app = express();

app.get(`/api/topics`, getTopics);

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: 'Bad request' });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Something went wrong' });
});

module.exports = app;
