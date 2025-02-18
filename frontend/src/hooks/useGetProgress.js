import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useGetProgress = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/progress/');
      
      if (response.data.success) {
        setProgress(response.data.data);
      } else {
        console.error("Failed to fetch progress:", response.data.message);
        setError('Failed to fetch progress');
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, loading, error, refetch: fetchProgress };
};

export default useGetProgress;
