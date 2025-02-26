import axios from 'axios';

const useTest = () => {
    const createTest = async (data) => {
        try {
            const response = await axios.post('/api/test/', data);
            return response.data.data;
        } catch (error) {
            console.error("Error creating test:", error.response?.data || error.message);
            throw error;
        }
    };

    const getTestByUserAndCourse = async (userId, courseId) => {
        try {
            const response = await axios.get(`/api/test/user/${userId}/course/${courseId}`);
            return response.data.data;
        } catch (error) {
            console.error("Error getting test:", error.response?.data || error.message);
            throw error;
        }
    };

    const updateTest = async (testId, data) => {
        try {
            const response = await axios.put(`/api/test/${testId}`, data);
            return response.data.data;
        } catch (error) {
            console.error("Error updating test:", error.response?.data || error.message);
            throw error;
        }
    };

    return { createTest, getTestByUserAndCourse, updateTest };
};

export default useTest;