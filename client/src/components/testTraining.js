import React, { useState } from 'react';

function TrainModel() {
    const [message, setMessage] = useState('');

    const handleTraining = async () => {
        fetch('http://localhost:9000/api/trainModel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                datasetId: '5010801042728681472', // Needs to be the id of the dataset used. Given when database is created in 'name' field
                bucketName: 'teststore', // Change to store name
                modelName: 'testmodel',
                pipelineName: 'testpipeline',
            }),
        })
            .then((res) => {
                //console.log(res); // Log the response to verify the request method
                setMessage('Model Finished Training!');
                return res.json();
            })
            .then((data) => {
                console.log(data);
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
