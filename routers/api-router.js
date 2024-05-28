const express = require('express');
const topicsRouter = require('./topics-router');
const articlesRouter = require('./articles-router')
const { getEndpoints } = require('../controllers/api-controller');

const apiRouter = express.Router();

apiRouter.use('/topics', topicsRouter);
apiRouter.get('/', getEndpoints);
apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;
