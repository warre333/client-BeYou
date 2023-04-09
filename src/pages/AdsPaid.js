import React from "react";
import { useSearchParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Confirm from "../components/advertisements/ConfirmPayment";

import { STRIPE } from "../config/api.config";

const stripePromise = loadStripe(STRIPE, { locale: "en" });

function AdsPaid() {
  const [searchParams, setSearchParams] = useSearchParams();

  if (searchParams.get('payment_intent_client_secret')) {
    const options = {
      clientSecret: searchParams.get('payment_intent_client_secret'),
      appearance: {},
    };

    return (
      <div className="">
        <div className="container mx-auto pt-10 md:pt-16 lg:pt-20">
          <p className="font-extrabold text-xl md:text-2xl lg:text-3xl text-center">
            Checkout
          </p>

          <Elements stripe={stripePromise} options={options}>
            <Confirm paymentIntent={searchParams.get('payment_intent_client_secret')} />
          </Elements>
        </div>
      </div>
    );
  }
}

export default AdsPaid;
