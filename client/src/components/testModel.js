import React, { useState } from 'react';
import * as automl from '@tensorflow/tfjs-automl';
import * as tf from '@tensorflow/tfjs';
import { BASE_URL } from '../apiconfig';
import StoreProfile from '../storeprofile';

function TestModel({ setModelData }) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const ms = 100; //Delay between model scans in ms
    let model = undefined;

    // Gets the model url for a store
    const getModelUrl = async (store) => {
        const artifactOutputUri = StoreProfile.getArtifactOutputUri();
        if (artifactOutputUri) {
            // Check if in local storage first
            console.log(`Found model ${artifactOutputUri} in local storage`);
            return artifactOutputUri;
        }

        console.log('Uri not found in local storage, fetching from server');

        // Fetches store info
        const response = await fetch(`${BASE_URL}/api/getStoreInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                store: store,
            }),
        });

        if (!response.ok) {
            console.log('Failed to fetch store data');
            return;
        }

        const data = await response.json();
        console.log(data);

        StoreProfile.setArtifactOutputUri(data.artifactOutputUri); // Save uri to local storage

        return data.artifactOutputUri;
    };

    const queryModel = async () => {
        let storeName = StoreProfile.getStoreName(); // Gets store name from local storage

        if (!storeName) {
            console.log('No store name found, using default store');
            storeName = 'snapstore';
        }

        let modelURL = await getModelUrl(storeName);
        if (!modelURL) {
            console.log('No model found for store, using default model');
            modelURL =
                'https://storage.googleapis.com/hackathon-401318-teststore/models/model-6898483287224745984/tf-js/2023-10-09T21:07:07.022206Z/model.json';
        }
        // Initialize model if not already
        setLoading(true);
        console.log('Loading model..');

        if (!model) {
            try {
                // Load the model
                model = await Promise.resolve(automl.loadImageClassification(modelURL));
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
            const reqProb = 0.4;

            if (resultdict === undefined) {
                resultdict = { ...result };
            }
            Object.keys(result).forEach((key) => {
                resultdict[key].label = result[key].label;
                resultdict[key].prob = result[key].prob;
            });

            const pred = Object.keys(resultdict).reduce((a, b) => (resultdict[a].prob > resultdict[b].prob ? a : b));

            {
                //console.log(result[pred])
                if (resultdict[pred].label === currentLabel && resultdict[pred].label !== 'Not Valid') {
                    if (resultdict[pred].prob >= reqProb) {
                        if (resultdict[pred].successfulChecks !== undefined) {
                            resultdict[pred].successfulChecks++;
                            console.log('Check Passed');
                        } else {
                            resultdict[pred].successfulChecks = 0;
                            console.log('Undefined Found');
                        }
                    } else {
                        if (resultdict[pred].successfulChecks === undefined) {
                            resultdict[pred].successfulChecks = 0;
                        }
                        console.log('Check Failed');
                    }
                } else {
                    currentLabel = resultdict[pred].label;
                    resultdict[pred].successfulChecks = 0;
                    console.log('Check Reset');
                }
            }

            setMessage(`prediction: ${resultdict[pred].label}, probability: ${resultdict[pred].prob}, checks: ${resultdict[pred].successfulChecks}`);

            // Set the prediction state
            setModelData(resultdict[pred]);

            img.dispose();
        };

        // Continuously make predictions and update state
        let currentLabel = '';
        let resultdict = undefined;
        const predictLoop = async () => {
            while (true) {
                await predict();
                await new Promise((r) => setTimeout(r, ms));
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
            <video autoPlay playsInline muted id="webcam" className="w-full h-2/3 object-cover"></video>
            {loading ? <></> : <button onClick={queryModel}>Test Model</button>}
            {message && <div>{message}</div>}
        </div>
    );
}

export default TestModel;
