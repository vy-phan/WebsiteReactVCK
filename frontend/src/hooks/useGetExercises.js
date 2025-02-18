import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetExercises = (lessonId) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/exercise/lesson/${lessonId}`);
        if (response.data.success) {
          setExercises(response.data.data);
        } else {
          setError('Failed to fetch exercises');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchExercises();
    }
  }, [lessonId]);

  return { exercises, loading, error };
};

export default useGetExercises;
