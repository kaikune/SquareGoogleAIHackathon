import React, { useState, useEffect } from 'react';
import * as automl from '@tensorflow/tfjs-automl';
import * as tf from '@tensorflow/tfjs';

function TestModel() {
    const [message, setMessage] = useState('');
    let model = undefined;

    const queryModel = async () => {
        // TODO: ModelURL should be passed into component instead of harcoded. Will be recieved by testTraining.js (from trainModel.js in server )
        const modelURL =
            'https://storage.googleapis.com/hackathon-401318-teststore/models/model-6898483287224745984/tf-js/2023-10-09T21:07:07.022206Z';
        // Initialize model if not already
        console.log('Loading model..');

        if (!model) {
            try {
                // Load the model
                model = await Promise.resolve(automl.loadImageClassification(`${modelURL}/model.json`));
                console.log(model);
            } catch (error) {
                console.error('Error loading model:', error);
            }
        }
        console.log('Successfully loaded model');

        // Create an object from Tensorflow.js data API which could capture image
        // from the web camera as Tensor.
        const webcamElement = document.getElementById('webcam');
        const webcam = await tf.data.webcam(webcamElement);

        // TODO: Figure out how to stop without reloading page
        while (true) {
            const img = await webcam.capture();
            const result = await model.classify(img);

            const pred = Object.keys(result).reduce((a, b) => (result[a].prob > result[b].prob ? a : b));

            setMessage(`prediction: ${result[pred].label}, probability: ${result[pred].prob}`);
            // Dispose the tensor to release the memory.
            img.dispose();

            // Give some breathing room by waiting for the next animation frame
            await tf.nextFrame();
            await new Promise((r) => setTimeout(r, 200));
        }
    };

    // // Use useEffect to start detecting objects right away
    // useEffect(() => {
    //     queryModel();
    // }, []);

    return (
        <div>
            <video autoPlay playsInline muted id="webcam" width="400" height="400"></video>
            <button onClick={queryModel}>Test Model</button>
            {message && <div>{message}</div>}
        </div>
    );
}

export default TestModel;
