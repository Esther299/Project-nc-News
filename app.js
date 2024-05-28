const express = require('express');
const apiRouter = require('./routers/api-router');

const app = express();

app.use(`/api`, apiRouter);


module.exports = app;

