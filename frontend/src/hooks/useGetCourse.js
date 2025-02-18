import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const useGetCourse = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('/api/course');
                setCourses(response.data.data);
            } catch (error) {
                setError(error.message);
                toast.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);
    return {courses, error, loading};
};

export default useGetCourse;