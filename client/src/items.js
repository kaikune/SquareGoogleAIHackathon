import React, { useState } from 'react';
import { BASE_URL } from './apiconfig.js';
import { Upload } from 'lucide-react';
import StoreProfile from './storeprofile.js';

function Items() {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [label, setLabel] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);

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

    const handleStockChange = (e) => {
        setStock(e.target.value);
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
                    bucketName: StoreProfile.getStoreName(), // Change to store name
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
        console.log(label);
        if (label === '') {
            setMessage('Please enter a label.');
            return;
        }

        if (Math.floor(stock) === stock || stock < 0) {
            setMessage('Please enter a valid stock');
            return;
        }

        setMessage('Preparing to upload files');

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
            setMessage('Files done uploading!');
        } catch (error) {
            setMessage(`File upload failed: ${error.message}`);
            return;
        }

        setMessage('Updating Inventory');

        const response = await fetch(`${BASE_URL}/api/inventory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fromState: 'NONE',
                toState: 'IN_STOCK',
                items: { id: label, quantity: stock },
            }),
        });

        if (!response.ok) {
            setMessage('Error updating inventory');
            return;
        }

        setMessage('Good to go!');
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-full gap-3 relative">
            <input className="w-2/3 h-1/3 opacity-0 cursor-pointer" type="file" multiple accept=".jpg" onChange={handleFileChange} />
            <div className="flex flex-col justify-center items-center w-2/3 h-1/3 bg-silver-300 border-dotted border-silver-500 border-8 rounded-full absolute top-20 pointer-events-none">
                <Upload size={100} />
                <h1 className="text-2xl font-bold">Upload Files</h1>
                {files.length <= 4 ? (
                    files.map((file) => <h1 key={file.name}>{file.name}</h1>)
                ) : (
                    <h1>
                        {files[0].name} <br /> + {files.length - 1} more...
                    </h1>
                )}
            </div>
            <input className="bg-gray-200 w-1/3 p-5 rounded-full" type="text" value={label} placeholder="Product Name" onChange={handleLabelChange} />
            <input className="bg-gray-200 w-1/3 p-5 rounded-full" type="number" value={price} placeholder="Price" onChange={handlePriceChange} />
            <input
                className="bg-gray-200 w-1/3 p-5 rounded-full"
                type="number"
                value={stock}
                placeholder="Initial Stock"
                onChange={handleStockChange}
            />
            <button className="bg-silver-500 w-1/3 px-8 py-4 rounded-full transition-all duration-300 hover:brightness-75" onClick={handleUpload}>
                <h1 className="text-white font-bold text-2xl uppercase">Upload</h1>
            </button>

            {message && <div>{message}</div>}
        </div>
    );
}

export default Items;
