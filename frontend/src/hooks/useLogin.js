// useLogin.js (ĐÃ SỬA ĐÚNG - LOẠI BỎ LƯU JWT VÀO LOCALSTORAGE)
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthContext } from '../context/AuthContext'

const useLogin = () => {
    const [loading, setLoading] = useState(false)
    const { setAuthUser } = useAuthContext()

    const login = async ({ email, password }) => {
        const { success, error } = handleInputErrors({ email, password })

        if (!success) {
            throw new Error(error);
        }

        setLoading(true);
        try {

            // Log thông tin chi tiết về request
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            };

            const res = await fetch('/api/auth/login', requestOptions);

            const data = await res.json();

            console.log("Response data from backend (useLogin):", data); // Log response data
            if (!data.success) {
                console.error('Login Failed:', {
                    message: data.message,
                    fullResponse: data
                });
                throw new Error(data.message || 'Đăng nhập thất bại')
            }


            // CẬP NHẬT AUTHCONTEXT VỚI THÔNG TIN NGƯỜI DÙNG (từ data.message)
            setAuthUser(data.message); // CẬP NHẬT AUTHCONTEXT VỚI THÔNG TIN USER

            return data.message; // TRẢ VỀ THÔNG TIN USER (cho component LoginForm nếu cần)

        } catch (error) {
            console.error('Login Catch Block Error:', {
                errorName: error.name,
                errorMessage: error.message,
                errorStack: error.stack
            });
            throw error;
        } finally {
            setLoading(false)
        }
    }

    function handleInputErrors({ email, password }) {
        if (!email || !password) {
            toast.error('Please fill in all fields')
            return { success: false, error: 'Please fill in all fields' }
        }

        if (!email.includes('@')) {
            toast.error('Please enter a valid email')
            return { success: false, error: 'Please enter a valid email' }
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return { success: false, error: 'Password must be at least 6 characters' }
        }

        return { success: true, error: null }
    }

    return { loading, login }
}

export default useLogin