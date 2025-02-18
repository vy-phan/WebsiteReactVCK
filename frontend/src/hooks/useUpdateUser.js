import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';

const useUserUpdate = () => {
    const { authUser, isAuthenticated } = useAuthContext();

    const updateUserInfo = async (id, data) => {
        try {
            if (!isAuthenticated) {
                throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
            }

            // Kiểm tra người dùng chỉ có thể cập nhật thông tin của chính họ
            if (id !== authUser?._id) {
                throw new Error('Không được phép cập nhật thông tin của người khác');
            }

            console.log('🔄 Đang cập nhật thông tin người dùng:', {
                userId: id,
                updateData: data
            });

            const response = await axios.put(`/api/auth/users/${id}`, data);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            console.log('✅ Cập nhật thành công:', response.data.data);
            return response.data.data;

        } catch (error) {
            console.error('❌ Lỗi cập nhật:', {
                message: error.message,
                response: error.response?.data
            });
            throw new Error(error.response?.data?.message || error.message);
        }
    };

    return { updateUserInfo };
};

export default useUserUpdate;