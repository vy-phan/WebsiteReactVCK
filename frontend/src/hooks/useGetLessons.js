import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useGetLessons = (courseId) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLessons = useCallback(async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`/api/lesson/course/${courseId}`);
      if (response.data.success) {
        setLessons(response.data.data);
      } else {
        setError("Failed to fetch lessons");
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const updateLessons = useCallback((newLessons) => {
    setLessons(newLessons);
  }, []);

  return { 
    lessons, 
    loading, 
    error,
    refetch: fetchLessons,
    setLessons: updateLessons
  };
};

export default useGetLessons;
