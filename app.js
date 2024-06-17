const express = require('express');
const apiRouter = require('./routers/api-router');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use(`/api`, apiRouter);

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Route not found' });
});

app.use((err, req, res, next) => {
  if (err.code === '22P02' || err.code === '23502') {
    res.status(400).send({ msg: 'Invalid input' });
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
  res.status(500).send({ msg: 'Something went really wrong' });
});

module.exports = app;
