import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';
import { React, useState } from 'react';
import { BASE_URL } from '../apiconfig';

export default function Payment({ price, items, setCart }) {
    const [message, setMessage] = useState('');

    return (
        <div className="w-full h-full p-5">
            {message && <h1 style={{ color: 'white' }}>{message}</h1>}
            <PaymentForm
                applicationId="sandbox-sq0idb-Os9kKkQZ44Ruc2n3kB1mIQ"
                cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
                    console.log(price);
                    // Sends card token (sourceId) to backend for processing
                    const response = await fetch(`${BASE_URL}/api/processPayment`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            sourceId: token.token,
                            total: price * 100, // Price in cents
                            items: items,
                        }),
                    });
                    const payRes = await response.json();
                    console.log(payRes);
                    if (typeof payRes === 'string') {
                        setMessage(payRes);
                        setCart([]);
                    } else {
                        setMessage('An error has occurred');
                    }
                }}
                locationId="L43EFGEFCY6Z4"
            >
                {/* Loads in credit card component */}
                <CreditCard
                    buttonProps={{
                        css: {
                            backgroundColor: '#ececec',
                            fontSize: '14px',
                            color: '#363636',
                            '&:hover': {
                                backgroundColor: '#dbdbdb',
                            },
                        },
                    }}
                />

                {/* Loads in payment form */}
            </PaymentForm>
        </div>
    );
}
