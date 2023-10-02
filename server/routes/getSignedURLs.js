var express = require('express');
var router = express.Router();
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');
const project = process.env.PROJECT_ID;

// req in the form of {bucketName: 'bucket name', label: 'product name', fileName: 'filename.jpeg'}
router.post('/', async function (req, res) {
    const label = req.body.label;
    const bucketName = `${project}-${req.body.bucketName}`;
    const fileName = `${label}/${req.body.fileName}`;

    // Creates a client
    const storage = new Storage({
        projectId: project,
        keyFilename: './avid-poet-398520-23056db53b7a.json',
    });

    //console.log(`bucketName: ${bucketName}, label: ${label}, product: ${fileName}`);

    // Updates CSV locally
    function updateCSV(fileNum) {
        // Adds the location of the image, label to the CSV
        const csv = `gs://${project}-${res.body.bucketName}/${label}/${fileNum}${fileName},${label}\n`;

        try {
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

    async function generateUploadSignedUrl(fileNum) {
        // These options will allow temporary uploading of the file
        const options = {
            version: 'v4',
            action: 'write',
            expires: Date.now() + 10 * 60 * 1000, // 10 minutes
            contentType: 'image/jpeg',
        };

        // Get a signed URL for uploading file
        const [url] = await storage.bucket(bucketName).file(`${fileNum}/${fileName}`).getSignedUrl(options);

        //console.log('Generated PUT signed URL:');
        //console.log(url);

        return url;
    }

    let urls = [];

    console.log('Generating signed urls');
    try {
        // Can change to whatever number of images we need
        for (let i = 0; i < 10; i++) {
            updateCSV(i);
            urls.push(await generateUploadSignedUrl(i));
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    }

    // Upload to bucket and delete CSV afterwards
    uploadCSV();

    // Send array of valid urls
    res.status(200).send(urls);
});

module.exports = router;
