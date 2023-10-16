import { React, useEffect, useState } from 'react';
import { Store } from 'lucide-react';

import { BASE_URL } from './apiconfig';

function Create() {
    const [store, setStore] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmission(e) {
        e.preventDefault();

        createDataset(store);
    }

    async function createUser(store, password, datasetID) {
        const response = await fetch(`${BASE_URL}/api/createUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                store: store,
                password: password,
                datasetID: datasetID,
            }),
        });

        if (!response.ok) {
            console.log('Error occurred when creating user');
        }

        const user = await response.json(); // Do whatever with user stuff
        console.log(user);
    }

    async function createDataset(store) {
        const response = await fetch(`${BASE_URL}/api/createDataset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bucketName: store.toLowerCase(),
                datasetName: `${store.toLowerCase()}dataset`,
            }),
        });

        if (!response.ok) console.log('Login failed :(');
        else {
            console.log('Login success!');
            const data = await response.json();
            //console.log(data);
            const datasetID = data[1].name.split('/').pop(); // Gets the datasetID

            await createUser(store, password, datasetID); // Creates dataset and returns its data
        }
    }

    return (
        <>
            <div className="flex flex-col justify-center items-center bg-gray-200 w-full h-full">
                <div className="flex flex-col justify-evenly items-center w-3/4 md:w-1/2 h-3/4 bg-white rounded-2xl drop-shadow-xl">
                    <div className="padding" />
                    <div className="flex flex-col justify-center items-center">
                        <Store color="black" size={100} />
                        <h1 className="text-black font-bold text-4xl uppercase tracking-wider select-none">Snap Cart</h1>
                    </div>

                    <div className="flex flex-col justify-center items-center w-full">
                        <form className="flex flex-col justify-center items-center w-full gap-4">
                            <input
                                className="bg-gray-200 w-1/2 p-5 rounded-full"
                                type="text"
                                value={store}
                                onChange={(e) => setStore(e.target.value)}
                                placeholder="SnapCart"
                            />
                            <input
                                className="bg-gray-200 w-1/2 p-5 rounded-full"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="password123"
                            />
                            <button
                                className="bg-silver-500 w-1/2 px-8 py-4 rounded-full transition-all duration-300 hover:brightness-75"
                                onClick={handleSubmission}
                            >
                                <h1 className="text-white font-bold text-2xl uppercase">Create Store</h1>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Create;
