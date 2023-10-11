import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';

export default function Home() {
    return (
        <div>
            <PaymentForm
                applicationId="sandbox-sq0idb-Os9kKkQZ44Ruc2n3kB1mIQ"
                cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
                    // Sends card token (sourceId) to backend for processing
                    const response = await fetch('http://localhost:9000/api/processPayment', {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            sourceId: token.token,
                            price: 100, // REPLACE WITH TOTAL COST (Price is in cents)
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
                            backgroundColor: '#771520',
                            fontSize: '14px',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#530f16',
                            },
                        },
                    }}
                />

                {/* Loads in payment form */}
            </PaymentForm>
        </div>
    );
}
