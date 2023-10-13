import React, { useState } from 'react';
import { BASE_URL } from '../apiconfig';

function CreateStorage() {
    const [storeName, setStoreName] = useState(''); // TODO: Find way to export to root so name can be shared across components
    const [message, setMessage] = useState('');

    const handleName = (e) => {
        setStoreName(e.target.value);
    };

    const storageHandler = async () => {
        setMessage('Creating Dataset...');
        fetch(`${BASE_URL}/api/createDataset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bucketName: storeName.toLowerCase(),
                datasetName: `${storeName.toLowerCase()}dataset`,
            }),
        })
            .then((res) => {
                if (res.ok) setMessage('Dataset Created');
                else setMessage('Something went wrong');
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
            <h1>Input Store Name</h1>
            <input type="text" value={storeName} onChange={handleName}></input>

            <h1>Test createDataset</h1>
            <button onClick={storageHandler}>Create Dataset</button>
            {message && <div>{message}</div>}
        </div>
    );
}

export default CreateStorage;
