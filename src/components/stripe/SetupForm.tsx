import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { CircularProgress } from '@material-ui/core';
import PaymentStatus from './PaymentStatus';

interface OwnProps {
  clientSecret: string;
}

const LoadingSpinner = () => (
  <div>
    <CircularProgress color="info" style={{ width: '30px', height: '30px' }} />
  </div>
);

const SetupForm = ({ clientSecret }: OwnProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);
    const { error } = await stripe.confirmSetup({
      //`Elements` instance that was used to create the Payment Element
      elements,
      redirect: 'if_required',
    });
    setLoading(false);

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (e.g., payment
      // details incomplete)
      setErrorMessage((error as any).message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      setShowSuccess(true);
    }
  };

  return (
    <>
      {!showSuccess ? (
        <form onSubmit={handleSubmit}>
          <PaymentElement />
          <button
            disabled={!stripe}
            type="submit"
            className="ml-3 mb-2 mr-2 px-3 py-2 bg-blue-800 disabled:bg-gray-300 disabled:cursor-default hover:bg-blue-700 text-white uppercase text-sm font-light transform ease-in-out duration-500 rounded shadow hover:shadow-md"
          >
            {loading ? <LoadingSpinner /> : 'Submit'}
          </button>
          {/* Show error message to your customers */}
          {errorMessage && <div>{errorMessage}</div>}
        </form>
      ) : (
        <div>
          <PaymentStatus clientSecret={clientSecret} />
        </div>
      )}
    </>
  );
};

export default SetupForm;
