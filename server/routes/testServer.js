var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.json([
        {
            test: "Do you have happiness"
        },
        {
            test: "I have happiness"
        }  
    ]);
});

module.exports = router;