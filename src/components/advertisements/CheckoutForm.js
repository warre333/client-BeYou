import React, {useState} from 'react';
import {useStripe, useElements, PaymentElement, Elements} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { STRIPE, WEBSITE_URL } from '../../config/api.config';


const CheckoutForm = ({ changePage, paymentIntent }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);

  function close(){
    changePage(0)
  }

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    const {error} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: WEBSITE_URL + 'ads/paid',
      },
    });


    if (error) {
      setErrorMessage(error.message);
    }
  };


  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-white">
      <div className="flex flex-row justify-between m-3">
        <div className="align-center">
          <button onClick={close}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
            </svg>  
          </button> 
        </div>

        <div className="">
          <p className="text-center font-bold text-2xl">Create advertisement</p>
        </div>
                    
        <div />
      </div>

      <div className="container mx-auto w-1/2">
        <PaymentElement />
        <button disabled={!stripe} onClick={handleSubmit} className="w-full mt-6 p-2 rounded-xl bg-accent text-white font-semibold bg-blue-500">Checkout</button>
        
        {errorMessage && <p className='mt-4 text-red-400'>{errorMessage}</p>}
      </div>
    </div>
  )
};

export default CheckoutForm;