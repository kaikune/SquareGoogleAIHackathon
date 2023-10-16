import { React } from "react";
import { Store } from 'lucide-react';
import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <div className="flex flex-col justify-center items-center bg-gray-200 w-full h-full">
                
                <div className="flex flex-col justify-evenly items-center w-3/4 md:w-1/2 h-3/4 bg-white rounded-2xl drop-shadow-xl">
                    <div className="padding"/>
                    <div className="flex flex-col justify-center items-center">
                        <Store color="black" size={100} />
                        <h1 className="text-black font-bold text-4xl uppercase tracking-wider select-none">Snap Cart</h1>
                    </div>

                    <div className="flex flex-col justify-center items-center w-full gap-4">
                        <Link className="flex felx-col justify-center items-center w-full" to="/create">
                            <button className="bg-silver-300 w-3/4 px-8 py-4 rounded-full transition-all duration-300 hover:brightness-75">
                                <h1 className="text-silver-500 font-bold text-2xl uppercase">Create</h1>
                            </button>
                        </Link>

                        <Link className="flex flex-col justify-center items-center w-full" to="/login">
                            <button className="bg-silver-500 w-3/4 px-8 py-4 rounded-full transition-all duration-300 hover:brightness-75">
                                <h1 className="text-white font-bold text-2xl uppercase">Log In</h1>
                            </button>
                        </Link>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Home;