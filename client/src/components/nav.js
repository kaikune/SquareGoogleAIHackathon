import { Link } from 'react-router-dom';

import { Tv2, Store, Cog } from 'lucide-react';

function Nav() {
    return (
        <>
            <div className="flex flex-row justify-evenly items-center w-full h-full bg-silver-500">
                <Link to={'/shop'}>
                    <button>
                        <Tv2 color="white" size={100} />
                    </button>
                </Link>
                <Link to={'/items'}>
                    <button>
                        <Store color="white" size={100} />
                    </button>
                </Link>
                <Link to={'/train'}>
                    <button>
                        <Cog color="white" size={100} />
                    </button>
                </Link>
            </div>
        </>
    );
}

export default Nav;
