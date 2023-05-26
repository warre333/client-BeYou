import React, {useState, useEffect} from 'react';
import {useStripe} from '@stripe/react-stripe-js';

function Confirm({ paymentIntent }){
    const stripe = useStripe();

    const [status, setStatus] = useState(0);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = paymentIntent;

        stripe.retrievePaymentIntent(clientSecret)
            .then(({paymentIntent}) => {
                switch (paymentIntent.status) {
                    case 'succeeded':
                        setStatus(1)
                        
                        break;

                    case 'processing':
                        setStatus(2)

                        break;

                    case 'requires_payment_method':
                        // Redirect your user back to your payment page to attempt collecting
                        // payment again
                        setStatus(3)

                        break;

                    default:
                        setStatus(4)

                        break;
                }
            });
    }, [stripe, paymentIntent]);


    return (
        <div className="w-full text-center mt-20 flex flex-col items-center">
            { status === 1 && (
                <div className="w-1/2 border-2 border-green-500 rounded-2xl flex flex-col items-center pt-20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="currentColor" class="bi bi-check-circle-fill text-green-500" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    <div className="pt-10 pb-20">
                        Success! Payment received.
                        <a href="/ads">
                            <p className="text-accent">Click here to see your ads.</p>
                        </a>
                    </div>
                </div>
            )}
            { status === 2 && (
                <div className="w-1/2 border-2 border-orange-500 rounded-2xl flex flex-col items-center pt-20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="currentColor" class="bi bi-hourglass-split text-orange-500" viewBox="0 0 16 16">
                        <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
                    </svg>
                    <div className="pt-10 pb-20">
                        Payment processing. 
                    </div>
                </div>
            )}
            { status === 3 && (
                <div className="w-1/2 border-2 border-red-500 rounded-2xl flex flex-col items-center pt-20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="currentColor" class="bi bi-x-circle-fill text-red-500" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                    </svg>
                    <div className="pt-10 pb-20">
                        Payment failed. Please try again.
                    </div>
                </div>
            )}
            { status === 4 && (
                <div className="w-1/2 border-2 border-gray-400 rounded-2xl flex flex-col items-center pt-20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="currentColor" class="bi bi-exclamation-circle-fill text-gray-400" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                    </svg>

                    <div className="pt-10 pb-20">
                        Something went wrong.
                    </div>
                </div>
            )}
        </div>
    );
};

export default Confirm