// DO NOT USE

const express = require('express');
const router = express.Router();
// const automl = require('@tensorflow/tfjs-automl');
// const tf = require('@tensorflow/tfjs-node');
const util = require('util');
const fs = require('fs');
const readImg = util.promisify(fs.readFile);

let model = undefined;

// req is in the form of { modelURL: 'model url', image: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | Tensor3D }
router.post('/', async function (req, res) {
    const modelURL = req.body.modelURL;
    let image = req.body.image;

    // Initialize model if not already
    if (!model) {
        try {
            // Load the model
            model = await automl.loadImageClassification(modelURL);
        } catch (error) {
            console.error('Error loading model:', error);
            return res.status(500).json({ error: 'Error loading model' });
        }
    }

    // FOR TESTING ONLY WHILE NOT FULLY SET UP
    image = await readImg('./public/images/image.jpg');
    image = tf.node.decodeImage(image, 3);

    // Get the classification from the model
    const classification = await model.classify(image);

    res.status(200).json(classification);
});

module.exports = router;
