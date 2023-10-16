var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const app = express();
const setupRoutes = require('./routes/index');
require('dotenv').config();

const corsOptions = {
    origin: true,
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Binds request handlers to their respective routes
setupRoutes(app);

module.exports = app;
