const express = require('express');
const topicsRouter = express.Router();
const { getTopics, postTopics } = require('../controllers/topics-controllers');

topicsRouter.get(`/`, getTopics);
topicsRouter.post(`/`, postTopics);

module.exports = topicsRouter;
