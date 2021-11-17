import Axios from 'axios';
import { useEffect, useState } from 'react';

export default function TestPage() {
  const [userInfo, setUserInfo] = useState('loading...');
  useEffect(() => {
    async function fetchData() {
      const response = await Axios.get('/api/users');
      setUserInfo(JSON.stringify(response));
    }
    fetchData();
  }, []);

  return <div>{userInfo}</div>;
}
