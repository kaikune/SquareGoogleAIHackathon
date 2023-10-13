import { React, useState } from "react";
import TestM from './components/testModel';

function Shop() {

    const [cart, setCart] = useState([]);

    // ITEM FORMAT:
    /*
    {
        id:         int,
        quantity:   int,
        name:       string,
        price:      float
    }
    */

    const [prediction, setPrediction] = useState('');

    function calculateTotalPrice() {
        let totalPrice = 0;
        for (const item of cart) {
          // Parse the price as a float and add it to the total
          totalPrice += parseFloat(item.price * item.quantity);
        }
        return totalPrice.toFixed(2); // Return the total price with two decimal places
    }

    const ItemCard = ({ id, name, price, image }) => {
        return (
            <button 
                className="flex flex-col justify-center items-center w-48 h-60 bg-white gap-2 rounded-xl drop-shadow-md"
                onClick={() => {
                    addItem({
                        id: id,
                        quantity: 1,
                        name: name,
                        price: price,
                    });
                    console.log(cart)
                }}
            >
                <img
                    className="w-full h-1/2 object-contain"
                    src={image} 
                />
                <h1>{name}</h1>
                <h1>${price}</h1> 
            </button>
        )
    }

    const ItemSlot = ({ id, quantity, name, price }) => {
        return (
            <div className="flex flex-row justify-between items-center w-full h-24 bg-gray-100 px-10" key={id}>
                <div className="flex flex-row justify-start items-center gap-10">
                    <h1 className="font-semibold text-3xl">{quantity}</h1>
                    <h1 className="font-bold text-xl opacity-60">{name}</h1>
                </div>
                <div className="flex flex-row justify-start items-center gap-10">
                    <h1 className="font-bold text-2xl">${(price * quantity).toFixed(2)}</h1>
                    <button 
                        className="font-bold text-xl opacity-60"
                        onClick={() => removeItem(id)}
                    >x</button>
                </div>
            </div>
        )
    }

    const Tray = () => {
        return (
            <div className="flex flex-col w-full h-full">
                {
                    cart.map((item) => (
                        <ItemSlot 
                            id={item.id}
                            quantity={item.quantity}
                            name={item.name}
                            price={item.price}
                        />
                    ))
                }
            </div>
        )
    }

    function checkItemInCart(itemId) {
        for (const item of cart) {
            if (item.id == itemId) {
                return true;
            }
        }
        return false;
    }

    function findItemInCart(itemId) {
        for (const i in cart) {
            const item = cart[i];
            if (item.id == itemId) {
                return i;
            }
        }
        return -1;
    }

    const addItem = (item) => {
        if (checkItemInCart(item.id)) {
            const newCart = [...cart];
            const index = findItemInCart(item.id);

            newCart[index].quantity += 1;
            setCart(newCart);
        } else {
            setCart((prevCart) => [...prevCart, item]);
        }
    }

    function removeItem(itemId) {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    }

    return (
        <>
        
            <div className="flex flex-row w-screen h-screen bg-white">

                <div className="flex flex-col w-full h-full">
                    <div className="flex flex-col justify-center items-center w-full h-full bg-silver-500">
                        <div className="w-3/4 h-3/4">
                            <TestM setPrediction={setPrediction} />
                            <button 
                                onClick=
                                {() => addItem(
                                    {
                                        // TODO: make this not hardcoded
                                        id: 0,
                                        quantity: 1,
                                        name: prediction,
                                        price: 1.00
                                    }
                                )}
                            >Add Item</button>
                            <h1>{prediction}</h1>
                        </div>
                    </div>
                    <div className="w-full h-1/4">

                    </div>
                </div>
                
                <div className="w-2/5 h-full bg-white">

                    <div className="flex flex-row justify-start items-center w-full h-1/6 px-12 gap-5 object-fill">
                        <img 
                            src="/bad.jpg"
                            className="w-20 h-20 rounded-full"
                        />
                        <h1 className="text-silver-500 font-bold text-3xl">JOHN SMITH</h1>
                    </div>

                    <div className="w-full h-4/6"><Tray /></div>

                    <div className="flex flex-col justify-start items-center w-full h-1/6 bg-silver-500 p-5">
                        <div className="flex flex-row justify-between items-center w-full px-5">
                            <h1 className="text-white font-bold text-2xl">subtotal</h1>
                            <h1 className="text-white font-bold text-2xl">{calculateTotalPrice()}</h1>
                        </div>
                        <div className="flex flex-row justify-between items-center w-full px-5">
                            <h1 className="text-white font-bold text-5xl">total</h1>
                            <h1 className="text-white font-bold text-5xl">{calculateTotalPrice()}</h1>
                        </div>
                    </div>

                </div>

            </div>
        
        </>
    ) 
}
  
export default Shop;