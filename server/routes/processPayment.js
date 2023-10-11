const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Client, Environment } = require('square');

// req is in the form of {sourceId: token, price: price (in cents) }
router.post('/', async function (req, res) {
    const client = new Client({
        accessToken: process.env.SQUARE_ACCESS_TOKEN,
        environment: Environment.Sandbox,
    });
    const { paymentsApi, locationsApi } = client;
    const price = req.body.price;
    const sourceId = req.body.sourceId; // Represents sourceId
    const locationResponse = await locationsApi.retrieveLocation(process.env.SQUARE_LOCATION_ID);
    const currency = locationResponse.result.location.currency; // Get currency

    console.log('Processing payment...');

    const body = {
        sourceId: sourceId,
        idempotencyKey: crypto.randomUUID(),
        amountMoney: {
            amount: BigInt(price),
            currency: currency,
        },
    };

    try {
        // Charge the card
        const {
            result: { payment },
        } = await paymentsApi.createPayment(body);

        const result = JSON.stringify(
            payment,
            (key, value) => {
                return typeof value === 'bigint' ? parseInt(value) : value;
            },
            4
        );
        console.log('Payment Successful');
        res.status(200).json(result);
    } catch (error) {
        console.log('Error charging card');
        res.json(error.result);
    }
});

module.exports = router;
