import { Task } from '.prisma/client';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SetupForm from 'src/components/stripe/SetupForm';

interface OwnProps {
  task: Task;
}

const stripePromise = loadStripe(
  'pk_test_51JFMlLAUYz6Zd3huK0oaHy21SQCNC4FoZGJsIVyvtVsFeqg9qMcy6jqzYq98iJMNnzrvNjZaMCKjkem7aoW8D6NS00Yl55hX5L'
);

export default function PaymentForm({ task }: OwnProps) {
  const [clientSecret, setClientSecret] = useState('');
  useEffect(() => {
    (async () => {
      const response = await Axios.post('/api/stripe/secret', { task });
      const { client_secret: clientSecret } = response.data;
      setClientSecret(clientSecret);
      console.log('received client secret', clientSecret);
    })();
  }, []);

  const options = {
    clientSecret,
  };

  return (
    <>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <SetupForm clientSecret={clientSecret} />
        </Elements>
      )}
    </>
  );
}
