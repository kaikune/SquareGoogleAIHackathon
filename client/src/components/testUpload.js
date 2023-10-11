import React, { useState } from 'react';
import { BASE_URL } from '../apiconfig.js';

function FileUpload() {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [label, setLabel] = useState('');

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleLabelChange = (e) => {
        setLabel(e.target.value);
    };

    async function getUrls(fileNames) {
        try {
            const response = await fetch(`${BASE_URL}/api/getSignedUrls`, {
                mode: 'cors',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bucketName: 'teststore', // Change to store name
                    label: label, // Label for all the images
                    fileNames: fileNames, // Send an array of file names
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            const data = await response.json();
            return data; // Return the data received from the server (an array of signed URLs)
        } catch (error) {
            console.error(error);
        }
    }

    const handleUpload = async () => {
        if (files.length === 0) {
            setMessage('Please select one or more files.');
            return;
        }

        const fileNames = files.map((file) => file.name); // Extract file names

        const signedUrls = await getUrls(fileNames); // Get signed URLs for the selected files

        try {
            for (let i = 0; i < files.length; i++) {
                const response = await fetch(signedUrls[i], {
                    mode: 'cors',
                    method: 'PUT',
                    body: files[i],
                    headers: { 'Content-Type': 'image/jpeg' },
                });

                if (response.ok) {
                    setMessage(`File ${fileNames[i]} uploaded successfully.`);
                } else {
                    setMessage(`File ${fileNames[i]} upload failed with status ${response.status}.`);
                }
            }
        } catch (error) {
            setMessage(`File upload failed: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Label</h1>
            <input type="text" value={label} onChange={handleLabelChange} />

            <h1>Upload Multiple Files</h1>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>

            {message && <div>{message}</div>}
        </div>
    );
}

export default FileUpload;
