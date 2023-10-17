import { React, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, ArrowLeft } from 'lucide-react';

import { BASE_URL } from './apiconfig';

import StoreProfile from './storeprofile';

function Login() {
    const navigate = useNavigate();

    const [store, setStore] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    function handleSubmission(e) {
        e.preventDefault();

        setMessage('Logging in');
        authStore(store, password);
    }

    function authStore(user, pass) {
        fetch(`${BASE_URL}/api/loginAuth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                store: user,
                password: pass,
            }),
        })
            .then((res) => {
                if (res.ok) {
                    console.log('login success!');
                    navigate('/items');
                } else {
                    throw Error('login failed :(');
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);

                const datasetId = data['datasetID'];
                StoreProfile.setDatasetId(datasetId); // store datasetId in localStorage

                const storeName = data['name'];
                StoreProfile.setStoreName(storeName);

                // Only store uri if model has been trained for this store
                const uri = data['artifactOutputUri'];
                if (uri) StoreProfile.setArtifactOutputUri(uri);
            })
            .catch((error) => {
                console.error(error);
                setMessage(error.message);
            });
    }

    return (
        <>
            <div className="flex flex-col justify-center items-center bg-gray-200 w-full h-full">
                <div className="flex flex-col justify-evenly items-center w-3/4 md:w-1/2 h-3/4 bg-white rounded-2xl drop-shadow-xl p-5">
                    <Link className="flex flex-col justify-center items-center w-full" to="/">
                        <ArrowLeft className="self-start" size={50} />
                    </Link>
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
                                <h1 className="text-white font-bold text-2xl uppercase">Log In</h1>
                            </button>
                            {message && <h1>{message}</h1>}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
