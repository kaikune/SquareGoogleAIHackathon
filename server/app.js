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
var getPrice = require('./routes/getPrice');
var getStoreInfo = require('./routes/getStoreInfo');

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

// TODO: Cleanup like in 546 lecture
app.use('/', indexRouter);
app.use('/api/testServer', testServerRouter);
app.use('/api/createDataset', createDataset);
app.use('/api/getSignedUrls', getSignedUrls);
app.use('/api/trainModel', trainModel);
app.use('/api/processPayment', processPayment);
app.use('/api/getPrice', getPrice);
app.use('/api/getStoreInfo', getStoreInfo);

module.exports = app;
