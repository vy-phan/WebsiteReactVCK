import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useForgotPassword from '../../hooks/useForgotPassword'; // Đảm bảo đường dẫn này đúng

const ForgotPasswordForm = ({ onSwitchMode, onResetPassword }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null); // Thay đổi state message để tránh lỗi
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useForgotPassword(); // Giả định bạn có hook này

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await forgotPassword(email);
      
      setEmail('');
      sessionStorage.setItem('verificationStartTime', Date.now().toString());
      onResetPassword(email);
    } catch (error) {
      // Trả về object message để tránh lỗi
      setMessage({
        type: 'error',
        content: error.response?.data?.message || t('resetError')
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        {t('forgotPassword')}
      </h2>

      {message && (
        <div className={`mb-4 p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.content}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {t('email')}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder={t("enterEmail")}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded-md text-white ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? t("sending") : t("sendResetLink")}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        {t('rememberedPassword')}{' '}
        <button
          onClick={() => onSwitchMode('login')}
          className="relative text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 
             overflow-hidden transition-all duration-300 ease-in-out 
             shadow-md shadow-blue-500/50 hover:shadow-lg hover:shadow-purple-500/70 
             hover:scale-105 hover:text-base
             before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full 
             before:bg-white/20 before:skew-x-[-30deg] before:transition-all before:duration-500 
             hover:before:left-[100%]"
        >
          {t('login')}
        </button>
      </p>
    </div>
  );
};

export default ForgotPasswordForm; 