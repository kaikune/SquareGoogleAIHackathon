const express = require('express');
var router = express.Router();
const crypto = require('crypto');
const { Client, Environment } = require('square');

// Updates inventory based on cart
async function updateInventory(client, location, itemIds, fromState, toState) {
    console.log(itemIds);
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
                fromState: fromState,
                toState: toState,
                locationId: location,
                catalogObjectId: itemId.id,
                quantity: String(itemId.quantity),
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
    console.log('Processing Items');
    const { catalogApi } = client;
    let itemIds = [];

    for (const item of items) {
        // Search for each item in catalog and get id of ITEM_VARIATION
        const filter = {
            textFilter: item.id,
        };

        const searchResponse = await catalogApi.searchCatalogItems(filter);

        itemIds.push({ id: searchResponse.result.items[0].itemData.variations[0].id, quantity: item.quantity }); // gets the item id from response
    }

    return itemIds;
}

// Update the inventory of an item
// req in the form of {fromState: 'STATE', toState: 'STATE', items: [{id: 'name', quantity: stock}]}
// STATE is either NONE | SOLD | IN_STOCK
router.post('/', async function (req, res) {
    const client = new Client({
        accessToken: process.env.SQUARE_ACCESS_TOKEN,
        environment: Environment.Sandbox,
    });
    const location = process.env.SQUARE_LOCATION_ID;
    const fromState = req.body.fromState;
    const toState = req.body.toState;
    const item = req.body.items;

    console.log('Attmpting to update inventory');
    try {
        const itemId = await processItems(client, [item]);
        await updateInventory(client, location, itemId, fromState, toState);
    } catch (err) {
        console.log('Inventory Error');
        console.log(err);
        res.sendStatus(500);
        return;
    }

    res.sendStatus(200);
});

// // Get the current inventory status of each item
// router.get('/', async function (req, res) {
//     res.sendStatus(404);
// });

module.exports = router;
