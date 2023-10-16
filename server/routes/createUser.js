var express = require('express');
var users = require('../data/users');
var router = express.Router();

// req in the form {store: 'store name', password: 'password', databaseID : 'databaseID'}
// Returns user if accepted
router.post('/', async function (req, res) {
    const storeName = req.body.store;
    const password = req.body.password;
    const databaseID = req.body.databaseID;
    try{
        const newUser = await users.addUser(storeName,password,databaseID);
        res.json({ user: newUser });
    }catch(e){
        res.status(500).json(err);
    }
});

module.exports = router;
