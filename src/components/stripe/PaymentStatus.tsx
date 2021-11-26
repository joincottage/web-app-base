import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';

interface OwnProps {
  clientSecret: string;
}

const PaymentStatus = ({ clientSecret }: OwnProps) => {
  const stripe = useStripe();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the SetupIntent
    stripe.retrieveSetupIntent(clientSecret).then(({ setupIntent }) => {
      if (!setupIntent) {
        console.error('Could not retrieve setupIntent');
        return;
      }

      // Inspect the SetupIntent `status` to indicate the status of the payment
      // to your customer.
      //
      // Some payment methods will [immediately succeed or fail][0] upon
      // confirmation, while others will first enter a `processing` state.
      //
      // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
      switch (setupIntent.status) {
        case 'succeeded':
          setMessage('Success! Your payment method has been saved.');
          break;

        case 'processing':
          setMessage(
            "Processing payment details. We'll update you when processing is complete."
          );
          break;

        case 'requires_payment_method':
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          setMessage(
            'Failed to process payment details. Please try another payment method.'
          );
          break;
      }
    });
  }, [stripe]);

  return <div>{message}</div>;
};

export default PaymentStatus;
