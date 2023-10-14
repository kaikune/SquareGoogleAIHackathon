import Payment from "./components/testPayment";
import { Store } from 'lucide-react';

function Pay() {
    return (
        <>

            <div className="flex flex-col justify-center items-center w-screen h-screen gap-5">
                <div className="flex flex-col justify-center items-center">
                    <Store color="black" size={100} />
                    <h1 className="text-black font-bold text-4xl uppercase tracking-wider select-none">Snap Cart</h1>
                </div>

                <Payment />
            </div>

        </>
    )
}

export default Pay;