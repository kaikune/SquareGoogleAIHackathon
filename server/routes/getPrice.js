var express = require('express');
var router = express.Router();
const { Client, Environment } = require('square');

// Gets the price of an item (in cents)
async function getItemPrice(client, label) {
    console.log(`Getting price of ${label}`);
    const { catalogApi } = client;

    // Search for each item in catalog and get id of ITEM_VARIATION
    const filter = {
        textFilter: label,
    };

    // Get catalog item matching label
    const searchResponse = await catalogApi.searchCatalogItems(filter);

    console.log(searchResponse.result);
    //if (!searchResponse.ok) throw response.errors; // Throw if there are errors in request

    let itemPrice = Number(searchResponse.result.items[0].itemData.variations[0].itemVariationData.priceMoney.amount); // gets the price from response
    console.log(itemPrice);
    return itemPrice / 100;
}

// req in the form {label: 'label'}
// Returns JSON of {price: price}
router.post('/', async function (req, res) {
    const client = new Client({
        accessToken: process.env.SQUARE_ACCESS_TOKEN,
        environment: Environment.Sandbox,
    });
    const label = req.body.label;
    let itemPrice = undefined;

    try {
        itemPrice = await getItemPrice(client, label);
        res.json({ price: itemPrice });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
