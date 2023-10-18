import { Link } from 'react-router-dom';

import { Tv2, Store, Cog } from 'lucide-react';

let heightMult = window.innerHeight/923
let widthMult = window.innerWidth/1920

let buttonSize = {
    width: `${100 * widthMult}`,
    height: `${106 * heightMult}`
}
function Nav() {
    return (
        <>
            <div className="flex flex-row justify-evenly items-center w-full h-full bg-silver-500">
                <Link to={'/shop'}>
                    <button style={buttonSize}>
                        <Tv2 color="white" size={100 * widthMult} />
                    </button>
                </Link>
                <Link to={'/items'}>
                    <button style={buttonSize}>
                        <Store color="white" size={100 * widthMult} />
                    </button>
                </Link>
                <Link to={'/train'}>
                    <button style={buttonSize}>
                        <Cog color="white" size={100 * widthMult} />
                    </button>
                </Link>
            </div>
        </>
    );
}

export default Nav;
