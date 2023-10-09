import React, { useState } from 'react';

function TestModel() {
    const [message, setMessage] = useState('');

    const testHandler = async () => {
        setMessage('Querying Model');
        fetch('http://localhost:9000/api/queryModel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                modelURL:
                    'https://storage.googleapis.com/hackathon-401318-teststore/models/model-6898483287224745984/tf-js/2023-10-09T04%3A33%3A52.569213Z/model.json',
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setMessage(JSON.stringify(data));
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div>
            <button onClick={testHandler}>Test Model</button>
            {message && <div>{message}</div>}
        </div>
    );
}

export default TestModel;
