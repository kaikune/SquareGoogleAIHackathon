var createDataset = require('./routes/createDataset');
var getSignedUrls = require('./routes/getSignedURLs');
var trainModel = require('./routes/trainModel');
var processPayment = require('./routes/processPayment');
var getPrice = require('./routes/getPrice');
var getStoreInfo = require('./routes/getStoreInfo');
var loginAuth = require('./routes/loginAuth');
var createUser = require('./routes/createUser');

const setupRoutes = (app) => {
    app.use('/api/createDataset', createDataset);
    app.use('/api/getSignedUrls', getSignedUrls);
    app.use('/api/trainModel', trainModel);
    app.use('/api/processPayment', processPayment);
    app.use('/api/getPrice', getPrice);
    app.use('/api/getStoreInfo', getStoreInfo);
    app.use('/api/loginAuth', loginAuth);
    app.use('/api/createUser', createUser);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

export default setupRoutes;
