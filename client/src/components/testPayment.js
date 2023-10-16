import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';
import { BASE_URL } from '../apiconfig';

export default function Payment({ price }) {
    return (
        <div className='w-full h-full p-5'>
            <PaymentForm
                applicationId="sandbox-sq0idb-Os9kKkQZ44Ruc2n3kB1mIQ"
                cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
                    // Sends card token (sourceId) to backend for processing
                    const response = await fetch(`${BASE_URL}/api/processPayment`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            sourceId: token.token,
                            price: price, // REPLACE WITH TOTAL COST (Price is in cents)
                        }),
                    });
                    console.log(await response.json());
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
