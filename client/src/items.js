import React, { useState } from 'react';
import { BASE_URL } from './apiconfig.js';
import { Upload } from 'lucide-react';

function Items() {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [label, setLabel] = useState('');
    const [price, setPrice] = useState(0);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        console.log(files);
    };

    const handleLabelChange = (e) => {
        setLabel(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
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
                    price: price * 100,
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
        <div className='flex flex-col justify-center items-center w-full h-full gap-3 relative'>
            <input
                className='w-2/3 h-1/2 opacity-0 cursor-pointer'
                type="file"
                multiple
                accept=".jpg"
                onChange={handleFileChange}
            />
            <div className='flex flex-col justify-center items-center w-2/3 h-1/2 bg-silver-300 border-dotted border-silver-500 border-8 rounded-full absolute top-20 pointer-events-none'>
                <Upload size={100}/>
                <h1 className='text-2xl font-bold'>Upload Files</h1>
                {
                    files.map((file) => (
                        <h1>{file.name}</h1>
                    ))
                }
            </div>
            <input 
                className="bg-gray-200 w-1/3 p-5 rounded-full"
                type="text" 
                value={label} 
                placeholder='Pasta Sauce'
                onChange={handleLabelChange} 
            />
            <input
                className="bg-gray-200 w-1/3 p-5 rounded-full"
                type="number" 
                value={price}
                placeholder='1.99'
                onChange={handlePriceChange} 
            />
            <button 
                className="bg-silver-500 w-1/3 px-8 py-4 rounded-full transition-all duration-300 hover:brightness-75"
                onClick={handleUpload}
            >
                <h1 className="text-white font-bold text-2xl uppercase">Upload</h1>
            </button>

            {message && <div>{message}</div>}
        </div>
    );
}

export default Items;