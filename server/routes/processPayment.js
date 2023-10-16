const express = require('express');
var router = express.Router();
const crypto = require('crypto');
const { Client, Environment } = require('square');

// Charge card from given payment source
async function processPayment(client, location, sourceId, total) {
    const { paymentsApi, locationsApi } = client;
    const locationResponse = await locationsApi.retrieveLocation(location);
    const currency = locationResponse.result.location.currency; // Get currency

    console.log('Processing payment...');

    const body = {
        sourceId: sourceId,
        idempotencyKey: crypto.randomUUID(),
        amountMoney: {
            amount: BigInt(total),
            currency: currency,
        },
    };

    // Charge the card
    const response = await paymentsApi.createPayment(body);
    if (response.errors) throw response.errors;

    console.log('Payment Successful');
    return response;
}

// Updates inventory based on cart
async function updateInventory(client, location, itemIds) {
    console.log('Updating inventory');
    const { inventoryApi } = client;
    const date = new Date();

    let batchUpdate = {
        idempotencyKey: crypto.randomUUID(),
        changes: [],
    };

    // Get each update to process in batch
    for (const itemId of itemIds) {
        const updateItem = {
            type: 'ADJUSTMENT',
            adjustment: {
                fromState: 'IN_STOCK',
                toState: 'SOLD',
                locationId: location,
                catalogObjectId: itemId, //Add inventory ID here
                quantity: '1',
                occurredAt: date.toISOString(), // RFC-3339 timestamp
            },
        };

        batchUpdate.changes.push(updateItem); // Add item to batch
    }

    // Update inventory
    const response = await inventoryApi.batchChangeInventory(batchUpdate);
    if (response.errors) throw response.errors;

    console.log('Inventory updated');
    return response;
}

// Gets items into item ids
async function processItems(client, items) {
    const { catalogApi } = client;
    let itemIds = [];

    // Search for each item in catalog and get id of ITEM_VARIATION
    for (const item of items) {
        const filter = {
            textFilter: item,
        };
        const searchResponse = await catalogApi.searchCatalogItems(filter);
        if (response.errors) throw response.errors;

        itemIds.push(searchResponse.items[0].item_data.variations[0].id); // gets the item id from response
    }

    return itemIds;
}

// req is in the form of {sourceId: token, total: price (in cents), items: [item]}
router.post('/', async function (req, res) {
    const client = new Client({
        accessToken: process.env.SQUARE_ACCESS_TOKEN,
        environment: Environment.Sandbox,
    });
    const total = req.body.total;
    const sourceID = req.body.sourceID;
    const items = req.body.items;
    const location = process.env.SQUARE_LOCATION_ID;

    let paymentResult = undefined;
    let itemIds = [];

    // Get array of item ids
    try {
        itemIds = await processItems(client, items);
    } catch (err) {
        console.log('Error processing items');
        res.status(500).json(err);
        return;
    }

    // Charge card
    try {
        paymentResult = await processPayment(client, location, sourceID, total);
    } catch (err) {
        console.log('Error processing payment');
        res.status(500).json(err);
        return;
    }

    // Update inventory to reflect sale
    try {
        const inventoryResult = await updateInventory(client, location, itemIds);
        paymentResult = { ...paymentResult, ...inventoryResult }; // Merge objs
    } catch (err) {
        console.log('Error updating inventory');
        res.status(500).json(err);
        return;
    }

    // Return result of payment and inventory
    res.status(200).json(paymentResult);
});

module.exports = router;
