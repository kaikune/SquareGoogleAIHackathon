var createDataset = require('./createDataset');
var getSignedUrls = require('./getSignedURLs');
var trainModel = require('./trainModel');
var processPayment = require('./processPayment');
var getPrice = require('./getPrice');
var getStoreInfo = require('./getStoreInfo');
var loginAuth = require('./loginAuth');
var createUser = require('./createUser');
var inventory = require('./inventory');

function setupRoutes(app) {
    app.use('/api/createDataset', createDataset);
    app.use('/api/getSignedUrls', getSignedUrls);
    app.use('/api/trainModel', trainModel);
    app.use('/api/processPayment', processPayment);
    app.use('/api/getPrice', getPrice);
    app.use('/api/getStoreInfo', getStoreInfo);
    app.use('/api/loginAuth', loginAuth);
    app.use('/api/createUser', createUser);
    app.use('/api/inventory', inventory);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
}

module.exports = setupRoutes;
