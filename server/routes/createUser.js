var express = require('express');
var users = require('../data/users');
var router = express.Router();

// req in the form {store: 'store name', password: 'password', datasetID : 'datasetID'}
// Returns user if accepted
router.post('/', async function (req, res) {
    const storeName = req.body.store;
    const password = req.body.password;
    const datasetID = req.body.datasetID;
    try {
        const newUser = await users.addUser(storeName, password, datasetID);
        res.json({ user: newUser });
    } catch (e) {
        res.status(500).json(err);
    }
});

module.exports = router;
