import {useEffect, useState} from 'react';
import axios from 'axios';

const baseURL = 'https://perfecten.store/wp-json/wp/v2/app_perfectflow/7';

const FetchData = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNow = async () => {
    try {
      const response = await axios.get(baseURL);
      setData(response.data?.acf ?? {});

      setLoading(false);
    } catch (error) {
      setError('error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNow();
  }, []);

  return {data, loading, error}; // Return an object with data, loading, and error
};

export default FetchData;
