var express = require('express');
const { DatasetServiceClient } = require('@google-cloud/aiplatform').v1;
var { Storage } = require('@google-cloud/storage');
var router = express.Router();
const project = process.env.PROJECT_ID;
const location = process.env.LOCATION;
const storage = new Storage({
    projectId: project,
    keyFilename: process.env.SECRET_KEY, // Overridden in production
}); // Creates a client

// Create image storage bucket
async function createStorage(bucketName) {
    // Add project to front of name because buckets are globally identifyable and dont want to conflict with other buckets
    const fullName = `${project}-${bucketName}`;
    const metadata = {
        cors: [
            {
                maxAgeSeconds: 3600,
                method: ['*'],
                origin: ['*'],
                responseHeader: ['Content-Type'],
            },
        ],
    };

    //storage.getBuckets().then((x) => console.log(x));

    try {
        console.log(`Creating new storage bucket: ${bucketName} ...`);

        await Promise.resolve(storage.createBucket(fullName, metadata));

        console.log('Bucket created!');

        // Make objects public
        await storage.bucket(fullName).makePublic();

        console.log(`Bucket ${bucketName} is now publicly readable`);

        return `Bucket ${fullName} created.`;
    } catch (err) {
        throw err;
    }
}

async function createDataset(datasetName) {
    // Instantiates a client
    const datasetServiceClient = new DatasetServiceClient({
        projectId: project,
        keyFilename: process.env.SECRET_KEY,
        apiEndpoint: 'us-central1-aiplatform.googleapis.com',
    });

    // Get parent directory
    const parent = `projects/${project}/locations/${location}`;

    // Set up dataset to handle images
    const dataset = {
        displayName: datasetName,
        metadataSchemaUri: 'gs://google-cloud-aiplatform/schema/dataset/metadata/image_1.0.0.yaml',
    };

    // Construct request
    const request = {
        parent,
        dataset,
    };

    console.log('Creating dataset ...');

    try {
        // Create Dataset Request
        const [response] = await datasetServiceClient.createDataset(request);
        console.log(`Long running operation : ${response.name}`);

        // Wait for operation to complete
        const [createDatasetResponse] = await response.promise(); // Holds the id for the dataset to be used to import data
        console.log(`Created dataset: ${datasetName}`);

        return createDatasetResponse;
    } catch (err) {
        throw err;
    }
}

/* POST request handler for creating a dataset for Vertex AI */
router.post('/', async function (req, res) {
    // Extract bucketName and datasetName from the request body
    console.log('createDataset() recieved POST request');
    const { bucketName, datasetName } = req.body;

    let [storageResult, datasetResult] = [undefined, undefined];

    try {
        storageResult = await Promise.resolve(createStorage(bucketName));
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
        return;
    }

    try {
        datasetResult = await Promise.resolve(createDataset(datasetName));
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
        return;
    }

    // Send the results as an array
    res.status(200).json([storageResult, datasetResult]);
});

module.exports = router;
