import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthContext } from '../context/AuthContext'

const useSignup = () => {
    const [loading, setLoading] = useState(false)
    const { setAuthUser } = useAuthContext()

    // Hàm chọn avatar ngẫu nhiên
    const getRandomAvatar = () => {
        const randomNum = Math.floor(Math.random() * 105) + 1; // Random từ 1 đến 105
        return `/avatar/avt_${randomNum}.jpg`;
    };

    const signup = async({ username, email, password, confirmPassword, gender }) => {
        const { success, error } = handleInputErrors({ username, email, password, confirmPassword, gender })
        
        if (!success) {
            throw new Error(error);
        }

        const avatarUrl = getRandomAvatar(); // Chọn avatar ngẫu nhiên

        setLoading(true);
        try {
            const res = await fetch('/api/auth/signup',{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    username, 
                    email, 
                    password, 
                    confirmPassword, 
                    gender,
                    avatarUrl // Thêm avatarUrl vào dữ liệu gửi đi
                }),
            })

            const data = await res.json()
            if (!data.success) {
                throw new Error(data.message)
            }
            // localstorage
            localStorage.setItem('user-course', JSON.stringify(data))
            // context
            setAuthUser(data)
            return data;

        } catch (error) {
            throw error;
        } finally {
            setLoading(false)
        }
    }

    return { loading, signup }
}

function handleInputErrors({ username, email, password, confirmPassword, gender }) {
    if (!username || !email || !password || !confirmPassword || !gender) {
        toast.error('Please fill in all fields')
        return { success: false, error: 'Please fill in all fields' }
    }

    if (password !== confirmPassword) {
        toast.error('Password does not match')
        return { success: false, error: 'Password does not match' }
    }

    if (password.length < 6) {
        toast.error('Password must be at least 6 characters')
        return { success: false, error: 'Password must be at least 6 characters' }
    }

    if (!email.includes('@')) {
        toast.error('Please enter a valid email')
        return { success: false, error: 'Please enter a valid email' }
    }

    return { success: true, error: null }
}

export default useSignup
