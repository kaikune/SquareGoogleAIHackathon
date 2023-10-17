import React, { useState } from 'react';
import { BASE_URL } from './apiconfig';
import { Loader2, Store } from 'lucide-react';

function Train() {
    const [message, setMessage] = useState('');
    const [modelURL, setModelURL] = useState('');

    const [loading, setLoading] = useState(false);

    const handleTraining = async () => {
        // set loading state
        setLoading(true);

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
                datasetId: data.datasetID, // Needs to be the id of the dataset used.
                bucketName: data.name, // Store name
                modelName: `${data.name}model`, // Model name
                pipelineName: `${data.name}pipeline`, // Pipeline name
            }),
        })
            .then((res) => {
                //console.log(res); // Log the response to verify the request method
                setLoading(false);
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
        <div className='flex flex-col justify-center items-center w-full h-full gap-5'>
            {
                !loading ? (
                    <>
                    
                        <div className="flex flex-col justify-center items-center">
                            <Store color="black" size={100} />
                            <h1 className="text-black font-bold text-4xl uppercase tracking-wider select-none">Snap Cart</h1>
                        </div>
                        <button className="bg-silver-500 text-white font-bold text-2xl px-24 py-5 rounded-full" onClick={handleTraining}>Train Model</button>
                        {message && <div>{message}</div>}
                    
                    </>
                ) : (
                    <Loader2 className='animate-spin' color="black" size={100}/>
                )
            }
        </div>
    );
}

export default Train;