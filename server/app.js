var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();
require('./data/db');
var indexRouter = require('./routes/index');
var testServerRouter = require('./routes/testServer');
var createDataset = require('./routes/createDataset');
var getSignedUrls = require('./routes/getSignedURLs');
var trainModel = require('./routes/trainModel');
var queryModel = require('./routes/queryModel');

var app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/testServer', testServerRouter);
app.use('/api/createDataset', createDataset);
app.use('/api/getSignedUrls', getSignedUrls);
app.use('/api/trainModel', trainModel);
app.use('/api/queryModel', queryModel);
module.exports = app;
