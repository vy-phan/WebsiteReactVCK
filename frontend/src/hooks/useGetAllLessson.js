import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetAllLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/lesson/`);
        if (response.data.success) {
          setLessons(response.data.data);
        } else {
          setError('Failed to fetch lessons');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  return { lessons, loading, error };
};

export default useGetAllLessons;
