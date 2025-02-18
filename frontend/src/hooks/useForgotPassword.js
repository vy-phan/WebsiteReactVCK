import { useAuthContext } from '../context/AuthContext';

const useForgotPassword = () => {
  const { requestPasswordReset } = useAuthContext();

  const forgotPassword = async (email) => {
    try {
      const result = await requestPasswordReset(email);
      return { success: true, data: result };
    } catch (error) {
      throw error;
    }
  };

  return { forgotPassword };
};

export default useForgotPassword; 