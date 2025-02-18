import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useGetLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/lesson");
      
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
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  return { lessons, loading, error, refetch: fetchLessons };
};

export default useGetLessons;
