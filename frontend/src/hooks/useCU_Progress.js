import axios from "axios";

const useCU_Progress = () => {
    const createProgress = async (data) => {
        try {
            const response = await axios.post("/api/progress/", data);
            return response.data.data;
        } catch (error) {
            console.error("Error creating progress:", error.response?.data || error.message);
            return null;
        }
    }
    const updateProgress = async (id, data) => {
        try {
            const response = await axios.put(`/api/progress/${id}`, data);
            return response.data.data;
        } catch (error) {
            console.error("Error updating progress:", error.response?.data || error.message);
            return null;
        }
    }
    return { createProgress, updateProgress };
}

export default useCU_Progress;