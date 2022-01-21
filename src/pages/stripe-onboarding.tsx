import Axios from 'axios';
import { useEffect } from 'react';

export default function TestPage() {
  useEffect(() => {
    async function fetchData() {
      const response = await Axios.get('/api/stripe/account-link');
      window.open(response.data.onboarding_url, '_self');
    }
    fetchData();
  }, []);

  return <div>Redirecting to Stripe onboarding flow...</div>;
}
