var express = require('express');
var users = require('../data/users');
var models = require('../data/models');
var router = express.Router();

// req in the form {store: 'store name'}
// Returns JSON of {storeinfo}
router.post('/', async function (req, res) {
    const storeName = req.body.store;
    const allUsers = await users.getAllUsers();

    // Search for store
    for (const user of allUsers) {
        if (user.name === storeName) {
            let storeInfo = undefined;
            try {
                const model = await models.getModelById(user._id);
                storeInfo = { ...user };
                storeInfo.artifactOutputUri = model.artifactOutputUri;
            } catch (err) {
                console.log('Error getting model');
                console.log(err);
                storeInfo = { ...user };
            }

            res.status(200).json(storeInfo);
            return;
        }
    }

    res.status(400).json({ error: 'Store not found' });
});

module.exports = router;
