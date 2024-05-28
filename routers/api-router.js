const express = require('express');
const topicsRouter = require('./topics-router');
const { getEndpoints } = require('../controllers/api-controller');

const apiRouter = express.Router();

apiRouter.use('/topics', topicsRouter);
apiRouter.get('/', getEndpoints);

apiRouter.use((err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: 'Bad request' });
  } else {
    next(err);
  }
});

apiRouter.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

apiRouter.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Something went really wrong' });
});

module.exports = apiRouter;
