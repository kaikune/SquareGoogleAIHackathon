import React, { useState } from 'react';
const automl = require('@tensorflow/tfjs-automl');
const tf = require('@tensorflow/tfjs-node');

function TestModel() {
    const [message, setMessage] = useState('');
    const [model, setModel] = useState(undefined);

    const testHandler = async () => {
        setMessage('Querying Model');
        fetch('http://localhost:9000/api/queryModel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                modelURL:
                    'https://storage.googleapis.com/hackathon-401318-teststore/models/model-6898483287224745984/tf-js/2023-10-09T21:07:07.022206Z/model.json',
            }),
        })
            .then((res) => {
                if (res.ok) return res.json();
                throw res;
            })
            .then((data) => {
                setMessage(JSON.stringify(data));
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const queryModel = async () => {
        const modelURL =
            'https://storage.googleapis.com/hackathon-401318-teststore/models/model-6898483287224745984/tf-js/2023-10-09T21:07:07.022206Z/model.json';
        // Initialize model if not already
        console.log('Loading model..');
        if (!model) {
            try {
                // Load the model
                setModel(await automl.loadImageClassification(modelURL));
            } catch (error) {
                console.error('Error loading model:', error);
            }
        }
        console.log('Successfully loaded model');

        // Create an object from Tensorflow.js data API which could capture image
        // from the web camera as Tensor.
        const webcamElement = document.getElementById('webcam');
        const webcam = await tf.data.webcam(webcamElement);

        while (true) {
            const img = await webcam.capture();
            const result = await model.classify(img);

            // console.log(result);
            document.getElementById('console').innerText = `
                prediction: ${result[0].label}\n
                probability: ${result[0].prob}
              `;
            // Dispose the tensor to release the memory.
            img.dispose();

            // Give some breathing room by waiting for the next animation frame to
            // fire.
            await tf.nextFrame();
        }
    };

    return (
        <div>
            <div id="console"></div>
            <video autoplay playsinline muted id="webcam" width="400" height="400"></video>
            <button onClick={queryModel}>Test Model</button>
            {message && <div>{message}</div>}
        </div>
    );
}

export default TestModel;
