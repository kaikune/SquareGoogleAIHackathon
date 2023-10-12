var express = require('express');
var router = express.Router();
const { Client, Environment } = require('square');

// Gets the price of an item (in cents)
async function getItemPrice(client, label) {
    const { catalogApi } = client;

    // Search for each item in catalog and get id of ITEM_VARIATION
    const filter = {
        textFilter: label,
    };

    // Get catalog item matching label
    const searchResponse = await catalogApi.searchCatalogItems(filter);
    if (response.errors) throw response.errors; // Throw if there are errors in request

    let itemPrice = searchResponse.items[0].item_data.variations[0].item_variation_data.price_money.amout; // gets the price from response

    return itemPrice;
}

// req in the form {label: 'label'}
// Returns JSON of {price: price}
router.get('/', async function (req, res, next) {
    const client = new Client({
        accessToken: process.env.SQUARE_ACCESS_TOKEN,
        environment: Environment.Sandbox,
    });
    const label = req.body.label;
    let itemPrice = undefined;
    // TODO: get price of item from database

    try {
        itemPrice = await getItemPrice(client, label);
    } catch (err) {
        res.status(500).json(err);
    }

    res.json({ price: price });
});

module.exports = router;
