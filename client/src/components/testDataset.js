import React, { useState } from 'react';

function CreateStorage() {
    const [storeName, setStoreName] = useState('');
    const [message, setMessage] = useState('');

    const handleName = (e) => {
        setStoreName(e.target.value);
    };

    const storageHandler = async () => {
        setMessage('Creating Dataset...');
        fetch('http://localhost:9000/api/createDataset', {
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
