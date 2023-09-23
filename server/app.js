var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testServerRouter = require('./routes/testServer');
var createDataset = require('./routes/createDataset');
var getSignedUrl = require('./routes/getSignedURL');
var trainModel = require('./routes/trainModel');

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
app.use('/users', usersRouter);
app.use('/testServer', testServerRouter);
app.use('/createDataset', createDataset);
app.use('/getSignedUrl', getSignedUrl);
app.use('/trainModel', trainModel);

module.exports = app;
