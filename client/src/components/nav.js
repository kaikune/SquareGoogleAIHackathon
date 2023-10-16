import { Link } from "react-router-dom";

import { Tv2, Store, Contact } from 'lucide-react';

function Nav() {
    return (
        <>
        
            <div className="flex flex-row justify-evenly items-center w-full h-full bg-silver-500">
                <Link to={"/shop"}>
                    <button>
                        <Tv2 color="white" size={100} />
                    </button>
                </Link>
                <button>
                    <Store color="white" size={100} />
                </button>
                <button>
                    <Contact color="white" size={100} />
                </button>
            </div>
        
        </>
    )
}

export default Nav;