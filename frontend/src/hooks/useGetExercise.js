import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useGetExercises = (lessonId = null) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/exercise?lessonId=${lessonId}`);

      if (response.data.success) {
        setExercises(response.data.data);
      } else {
        setError('Failed to fetch exercises');
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);


  return { exercises, loading, error, refetch: fetchExercises };
};

export default useGetExercises;
