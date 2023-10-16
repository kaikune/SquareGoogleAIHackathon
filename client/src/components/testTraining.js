import React, { useState } from 'react';
import { BASE_URL } from '../apiconfig';

function TrainModel() {
    const [message, setMessage] = useState('');
    const [modelURL, setModelURL] = useState('');

    const handleTraining = async () => {
        fetch(`${BASE_URL}/api/trainModel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // TODO: Replace values with actual stuff
                datasetId: '5010801042728681472', // Needs to be the id of the dataset used. Given when database is created in 'name' field (testDataset)
                bucketName: 'teststore', // Change to store name (store name from testDataset)
                modelName: 'teststoremodel', // Change model name (I dont think this really matters)
                pipelineName: 'teststorepipeline', // change pipeline name
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
                setModelURL(`${data.replace('gs:/', 'https://storage.googleapis.com')}/model.json`);
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
