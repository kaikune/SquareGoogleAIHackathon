import React, { useState } from 'react';
import { BASE_URL } from '../apiconfig';

function TrainModel() {
    const [message, setMessage] = useState('');
    const [modelURL, setModelURL] = useState('');

    const handleTraining = async () => {
        // Gets store info
        const response = await fetch(`${BASE_URL}/api/getStoreInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                store: 'snapstore', // replace with actual store name
            }),
        });

        if (!response.ok) {
            console.log('Failed to fetch store data');
            return;
        }

        const data = await response.json();
        // TODO: Save data.artifactOutputUri somewhere
        console.log(data);

        // Trains model
        fetch(`${BASE_URL}/api/trainModel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // TODO: Replace values with actual stuff
                datasetId: data.datasetID, // Needs to be the id of the dataset used. Given when database is created in 'name' field (testDataset)
                bucketName: data.name, // Change to store name (store name from testDataset)
                modelName: 'model', // Change model name (I dont think this really matters)
                pipelineName: 'modelpipeline', // change pipeline name
            }),
        })
            .then((res) => {
                //console.log(res); // Log the response to verify the request method
                setMessage('Model Finished Training!');
                if (res.ok) return res.json();
                throw res;
            })
            .then((data) => {
                // Sets the url of the model to be accessible
                // TODO: Send modelURL to root so it can be passed to testModel
                setModelURL(data);
                console.log(modelURL);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div>
            <button onClick={handleTraining}>Train Model</button>
            {message && <div>{message}</div>}
        </div>
    );
}

export default TrainModel;
