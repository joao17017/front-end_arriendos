import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import NavBar from './NavBar';

const TestAxios = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('/TestAxios');
      setData(response.data);
      setError('');
    } catch (err) {
      console.error('Error:', err.response || err.message);
      setError(err.response?.data?.error || 'Error fetching data');
    }
  };

  return (
    <div>
      <NavBar />
      <button onClick={fetchData}>Fetch Data</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default TestAxios;
