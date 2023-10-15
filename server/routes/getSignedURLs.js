var express = require('express');
var router = express.Router();
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');
const project = process.env.PROJECT_ID;
const { Client, Environment } = require('square');
const crypto = require('crypto');

// TODO: Update to create the item in catalog at some point (take in price as well and inventory size)
// req in the form of {bucketName: 'bucket name', label: 'product name', fileNames: ['filename.jpeg']}
router.post('/', async function (req, res) {
    const label = req.body.label;
    const bucketName = `${project}-${req.body.bucketName}`;
    const fileNames = req.body.fileNames;
    const price = req.body.price;

    //console.log(`Recieved input of {${bucketName}, ${label}, ${fileNames}, ${price}}`);

    const client = new Client({
        accessToken: process.env.SQUARE_ACCESS_TOKEN,
        environment: Environment.Sandbox,
    });

    // Creates a client
    const storage = new Storage({
        projectId: project,
        keyFilename: process.env.SECRET_KEY,
    });

    let catalogItem = {
        idempotencyKey: crypto.randomUUID(),
        object: {
            type: 'ITEM',
            id: '#' + label,
            itemData: {
                name: label,
                variations: [
                  {
                    type: 'ITEM_VARIATION',
                    id: '#' + label + '_var',
                    itemVariationData: {
                        pricingType: 'FIXED_PRICING',
                        priceMoney: {
                            amount: price,
                            currency: 'USD'
                        },
                        sellable: true
                    }
                  }
                ]
              }
            }
          }
    const response = await client.catalogApi.upsertCatalogObject(catalogItem);
    
    // Download csv from gcs to update it. Throws error if file not found
    async function downloadCSV() {
        const options = {
            destination: './public/images.csv',
        };

        // Downloads the file

        try {
            await storage.bucket(bucketName).file('images.csv').download(options);
            console.log('images.csv downloaded');
        } catch {
            console.log('images.csv not found, creating local file');
        }
    }

    // Updates CSV locally
    function updateCSV(fileName, fileNum) {
        // Adds the location of the image, label to the CSV
        const csv = `gs://${bucketName}/${label}/${fileNum}${fileName},${label}\n`;

        try {
            // Appends to file if found else create new file and write to it
            fs.appendFileSync('./public/images.csv', csv);
        } catch (err) {
            console.error(err);
        }
    }

    // Uploads updated CSV to GCS
    async function uploadCSV() {
        const options = {
            destination: 'images.csv',
        };
        try {
            // Upload CSV to GCS using async/await
            await storage.bucket(bucketName).upload('./public/images.csv', options);

            console.log(`Image images.csv uploaded to ${bucketName}.`);

            // Delete local CSV after successful upload
            fs.unlink('./public/images.csv', (err) => {
                if (err) {
                    console.error(`Error deleting local CSV file: ${err.message}`);
                } else {
                    console.log('Local CSV file deleted successfully.');
                }
            });
        } catch (err) {
            console.error(`Error uploading images.csv: ${err.message}`);
        }
    }

    async function generateUploadSignedUrl(fileName, fileNum) {
        // These options will allow temporary uploading of the file
        const options = {
            version: 'v4',
            action: 'write',
            expires: Date.now() + 10 * 60 * 1000, // 10 minutes
            contentType: 'image/jpeg',
        };

        // Get a signed URL for uploading file
        const [url] = await storage.bucket(bucketName).file(`${label}/${fileNum}${fileName}`).getSignedUrl(options);

        //console.log('Generated PUT signed URL:');
        //console.log(url);

        return url;
    }

    console.log('Attempting to download images.csv from csv');
    await downloadCSV();

    let urls = [];
    console.log('Generating signed urls');
    try {
        // Can change to whatever number of images we need
        for (let i = 0; i < fileNames.length; i++) {
            updateCSV(fileNames[i], i);
            urls.push(await generateUploadSignedUrl(fileNames[i], i));
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    }

    // Upload to bucket and delete CSV afterwards
    uploadCSV();

    // Send array of valid urls
    //res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.status(200).send(urls);
});

module.exports = router;
