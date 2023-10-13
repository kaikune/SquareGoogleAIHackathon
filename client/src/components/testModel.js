import React, { useState, useEffect } from 'react';
import * as automl from '@tensorflow/tfjs-automl';
import * as tf from '@tensorflow/tfjs';

function TestModel({ setPrediction }) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    let model = undefined;

    const queryModel = async () => {
        // TODO: ModelURL should be passed into component instead of harcoded. Will be recieved by testTraining.js (from trainModel.js in server )
        const modelURL =
            'https://storage.googleapis.com/hackathon-401318-teststore/models/model-6898483287224745984/tf-js/2023-10-09T21:07:07.022206Z';
        // Initialize model if not already
        setLoading(true);
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

        // Create a function for making predictions
        const predict = async () => {
            const img = await webcam.capture();
            const result = await model.classify(img);

            const pred = Object.keys(result).reduce((a, b) => (result[a].prob > result[b].prob ? a : b));

            setMessage(`prediction: ${result[pred].label}, probability: ${result[pred].prob}`);

            // Set the prediction state
            setPrediction(result[pred].label);

            img.dispose();
        };

        // Continuously make predictions and update state
        const predictLoop = async () => {
            while (true) {
                await predict();
                await tf.nextFrame();
            }
        };

        // Start the prediction loop
        predictLoop();
    };

    // // Use useEffect to start detecting objects right away
    // useEffect(() => {
    //     queryModel();
    // }, []);

    return (
        <div>
            <video autoPlay playsInline muted id="webcam" className='w-full h-5/6 object-cover'></video>
            {loading ? (<></>) : (<button onClick={queryModel}>Test Model</button>)}
            {message && <div>{message}</div>}
        </div>
    );
}

export default TestModel;
