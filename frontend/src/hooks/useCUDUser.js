import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';

const useCUDUser = () => {
    const { authUser, isAuthenticated } = useAuthContext();

    // Helper function kiểm tra quyền admin
    const checkAdminAuth = () => {
        if (!isAuthenticated || authUser?.role !== 'admin') {
            throw new Error('Unauthorized - Admin access required');
        }
    };

    const createUser = async (data) => {
        try {
            checkAdminAuth();
            const response = await axios.post("/api/auth/admin/users", data);
            return response.data.data;
        } catch (error) {
            console.error("Error creating user:", error.response?.data || error.message);
            return null;
        }
    };

    const updateUser = async (id, data) => {
        try {
            checkAdminAuth();
            const response = await axios.put(`/api/auth/admin/users/${id}`, data);
            return response.data.data;
        } catch (error) {
            console.error("Error updating user:", error.response?.data || error.message);
            return null;
        }
    };
    const updateUserInfo = async (data) => {
        try {
            // Đảm bảo có authUser._id và định dạng endpoint đúng
            if (!authUser?._id) {
                throw new Error('Không tìm thấy ID người dùng');
            }

            const response = await axios.put(`/api/auth/users/${authUser._id}`, data);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Cập nhật thất bại');
            }

            console.log("Cập nhật thành công:", response.data);
            return response.data.data;
        } catch (error) {
            console.error("Lỗi cập nhật:", {
                message: error.message,
                response: error.response?.data
            });
            throw new Error(error.response?.data?.message || 'Cập nhật thất bại');
        }
    };

    const deleteUser = async (id) => {
        try {
            checkAdminAuth();
            const response = await axios.delete(`/api/auth/admin/users/${id}`);
            return response.data.data;
        } catch (error) {
            console.error("Error deleting user:", error.response?.data || error.message);
            return null;
        }
    };

    return { createUser, updateUser, deleteUser, updateUserInfo};
};

export default useCUDUser;