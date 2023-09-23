var express = require('express');
var router = express.Router();
const project = process.env.PROJECT_ID;

// req in the form of {bucketName: 'bucket name', product: 'product name', fileName: 'filename.jpeg'}
router.get('/', function (req, res) {
    // The ID of GCS bucket
    const bucketName = req.bucketName;

    // The product/label of the image
    const label = req.product;

    // The full path of your file inside the GCS bucket
    const fileName = `${label}/${req.fileName}`;

    // Imports the Google Cloud client library
    const { Storage } = require('@google-cloud/storage');

    // Creates a client
    const storage = new Storage({
        projectId: project,
        credentials: require('../avid-poet-398520-23056db53b7a.json'),
    });

    // Updates CSV locally
    function updateCSV() {
        const csv = `gs://${project}-${bucketName}/${fileName},${label}\n`;
        try {
            appendFileSync('./images.csv', csv);
        } catch (err) {
            console.error(err);
        }

        const options = {
            destination: 'images.csv',
        };
    }

    // Uploads updated CSV to GCS
    async function uploadCSV() {
        bucket.upload(fileName, options, function (err) {
            if (err) {
                console.error(
                    `Error uploading image image_to_upload.jpeg: ${err}`
                );
            } else {
                console.log(
                    `Image image_to_upload.jpeg uploaded to ${bucketName}.`
                );
            }
        });
    }

    async function generateUploadSignedUrl() {
        // These options will allow temporary uploading of the file
        const options = {
            version: 'v4',
            action: 'write',
            expires: Date.now() + 1 * 60 * 1000, // 1 minute
            contentType: 'image/jpeg',
        };

        // Get a v4 signed URL for uploading file
        const [url] = await storage
            .bucket(bucketName)
            .file(fileName)
            .getSignedUrl(options);

        console.log('Generated PUT signed URL:');
        console.log(url);

        // Updating CSV
        updateCSV();
        return url;
    }

    urls = [];

    try {
        // Can change to whatever number of images we need
        for (let i = 0; i < 10; i++) {
            urls.push(generateUploadSignedUrl());
        }
    } catch (err) {
        console.log(err);
    }

    uploadCSV();

    // Send array of valid urls
    res.send(urls);
});

module.exports = router;
