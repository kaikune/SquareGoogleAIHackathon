var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var testServerRouter = require('./routes/testServer');
var createDataset = require('./routes/createDataset');
var getSignedUrls = require('./routes/getSignedURLs');
var trainModel = require('./routes/trainModel');
var processPayment = require('./routes/processPayment');
//var queryModel = require('./routes/queryModel');

var app = express();

const corsOptions = {
    origin: true,
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
app.use('/api/processPayment', processPayment);
//app.use('/api/queryModel', queryModel);
module.exports = app;
