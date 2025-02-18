import axios from "axios";
import { useEffect, useState } from "react";

const useCRUD_Schedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/schedule/`);
                if (response.data.success) {
                    setSchedule(response.data.data);
                } else {
                    setError('Failed to fetch schedule');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    const createSchedule = async (data) => {
        try {
            const response = await axios.post(`/api/schedule/`, data);
            if (response.data.success) {
                setSchedule([...schedule, response.data.data]);
            } else {
                setError('Failed to create schedule');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const updateSchedule = async (id, data) => {
        try {
            const response = await axios.put(`/api/schedule/${id}`, data );
            if (response.data.success) {
                setSchedule(schedule.map(post => post._id === id ? response.data.data : post));
            } else {
                setError('Failed to update schedule');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteSchedule = async (id) => {
        try {
            const response = await axios.delete(`/api/schedule/${id}`);
            if (response.data.success) {
                setSchedule(schedule.filter(schedu => schedu._id !== id));
            } else {
                setError('Failed to delete schedule');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const getScheduleByUserId = async (id) => {
        try {
            const response = await axios.get(`/api/schedule/${id}`);
            if (response.data.success) {
                return response.data.data;
            } else {
                setError('Failed to get schedule');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return { schedule, loading, error, createSchedule, updateSchedule, deleteSchedule, getScheduleByUserId };
};

export default useCRUD_Schedule;