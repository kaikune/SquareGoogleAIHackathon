var express = require('express');
var users = require('../data/users');
var router = express.Router();

// req in the form {store: 'store name', password: 'password'}
// Returns true if accepted feel free to change this 
router.post('/', async function (req, res) {
    const storeName = req.body.store;
    const password = req.body.password;
    const allUsers = await users.getAllUsers();

    // Search for store
    for (const user of allUsers) {
        if (user.name === storeName) {
            if(user.pass === password){
                res.json(true);
            }            
        }
    }

    res.status(500).json({ error: 'Store not found' });
});

module.exports = router;
