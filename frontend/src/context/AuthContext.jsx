import axios from 'axios';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"; // Import useCallback và useMemo
import toast from "react-hot-toast";
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';

// Tạo context cho việc quản lý xác thực
export const AuthContext = createContext();


export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
    const { t } = useTranslation();
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const isMounted = React.useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);


    const fetchCurrentUser = useMemo(() => {
        return async (abortController) => {
            console.log("🔄 Bé AuthContext: Dạ anh ơi! Đợi bé kiểm tra thông tin anh cái (ಥ _ ಥ)");
            setLoading(true);

            try {
                const res = await axios.get('/api/auth/me', {
                    signal: abortController.signal
                });

                if (!isMounted) return;

                const data = res.data;

                if (res.status === 200 && data.success) {
                    console.log(`✅ Bé AuthContext: A! Bé đã thấy thông tin của anh ${data.message.username} rồi! (＞﹏＜)`, {
                        "Chào anh": data.message.username,
                        "id anh là": data.message._id
                    });
                    setAuthUser(data.message);
                    setIsAuthenticated(true);
                } else {
                    console.log("❌ API trả về lỗi - Xóa thông tin user");
                    setIsAuthenticated(false);
                    setAuthUser(null);
                }
            } catch (error) {
                if (!isMounted) return;

                console.error("❌ Bé AuthContext: Dạ anh ơi! Đăng nhập đi mà (┬┬﹏┬┬), lỗi: ", error.message);
                setIsAuthenticated(false);
                setAuthUser(null);
            } finally {
                 if (isMounted) {
                    setLoading(false);
                }
            }
        };
    }, []);

    useEffect(() => {
        const abortController = new AbortController();
        let timeoutId;

        const initFetch = async () => {
            // Thêm delay nhỏ để tránh race condition
            timeoutId = setTimeout(async () => {
                await fetchCurrentUser(abortController);
            }, 100);
        };

        initFetch();

        // Cleanup function
        return () => {
            clearTimeout(timeoutId);
            abortController.abort();
        };
    }, [fetchCurrentUser]);


    const initiateSignup = useCallback(async (userData) => {
        setLoading(true);
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(t('verificationCodeSent'));
                return true;
            } else {
                const errorMessage = data.message || t('codeSendError');
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Signup initiation error:", error);
            toast.error(t('codeSendError'));
            throw error;
        } finally {
            setLoading(false);
        }
    }, [t]); // Dependency: t

    const completeSignup = useCallback(async (email, verificationCode) => { // Sử dụng useCallback
        setLoading(true);
        try {
            const response = await fetch("/api/auth/complete-signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, verificationCode }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(t('registerSuccess'));
                return true;
            } else {
                let errorMessage = t('verificationError');
                if (data.message === 'No pending registration found') {
                    errorMessage = t('noPendingRegistration');
                } else if (data.message === 'Invalid verification code') {
                    errorMessage = t('invalidVerificationCode');
                }
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Signup completion error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [t]); // Dependency: t

    const requestPasswordReset = useCallback(async (email) => { // Sử dụng useCallback
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/request-password-reset', { email }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.data.success) {
                throw new Error(response.data.message || t('resetError'));
            }

            toast.success(response.data.message || t('resetLinkSent'));
            return response.data;
        } catch (error) {
            console.error('Password reset request error:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || t('resetError'));
            throw error;
        } finally {
            setLoading(false);
        }
    }, [t]); // Dependency: t

    const resetPassword = useCallback(async (email, resetCode, newPassword) => { // Sử dụng useCallback
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/reset-password', {
                email,
                resetCode,
                newPassword
            });

            if (!response.data.success) {
                throw new Error(response.data.message || t('resetError'));
            }

            const data = response.data;
            toast.success(t('passwordResetSuccess'));
            return data;
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || t('resetError'));
            throw error;
        } finally {
            setLoading(false);
        }
    }, [t]); // Dependency: t


    // Giá trị context được memoize bằng useMemo
    const contextValue = useMemo(() => ({ // Sử dụng useMemo
        authUser,
        setAuthUser,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        initiateSignup, // Sử dụng hàm memoized
        completeSignup, // Sử dụng hàm memoized
        requestPasswordReset, // Sử dụng hàm memoized
        resetPassword, // Sử dụng hàm memoized
    }), [authUser, isAuthenticated, loading, initiateSignup, completeSignup, requestPasswordReset, resetPassword]); // Dependencies: states và các hàm memoized

    // // Chỉ render children khi đã fetch xong data
    // if (loading) {
    //     return <LoadingSpinner />;
    // }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};