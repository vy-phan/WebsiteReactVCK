import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import axios from "axios"; // Import axios để gọi API
import toast from 'react-hot-toast'; // Import toast

const ResetPasswordForm = ({ onSwitchMode, email }) => {
  const { t } = useTranslation();
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onSwitchMode("login"); // Quay về modal đăng nhập khi hết thời gian
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onSwitchMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", content: "" });

    // Kiểm tra email trước khi sử dụng
    if (!email) {
      setMessage({
        type: "error",
        content: t("emailRequired")
      });
      setIsLoading(false);
      return;
    }

    // Kiểm tra các trường đã được nhập đầy đủ
    if (!verificationCode || !newPassword || !confirmPassword) {
      setMessage({
        type: "error",
        content: t("allFieldsRequired"),
      });
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        content: t("passwordMismatch"),
      });
      setIsLoading(false);
      return;
    }

    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        content: t("passwordTooShort"),
      });
      setIsLoading(false);
      return;
    }

    try {
      // Gửi mật khẩu gốc, để backend xử lý việc hash
      const response = await axios.post('/api/auth/reset-password', {
        email,
        resetCode: verificationCode,
        newPassword: newPassword // Gửi mật khẩu gốc
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || t('resetError'));
      }

      toast.success(response.data.message || t('passwordResetSuccess'));
      onSwitchMode('login');
    } catch (error) {
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
        {t("resetPassword")}
      </h2>

      {message.content && (
        <div
          className={`mb-4 p-4 rounded-md ${message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
            }`}
        >
          {message.content}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {t("verificationCode")}
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        </div>
        <div className="ml-4 text-sm text-end text-red-500">
          {t("timeremaining")} {" "}
          {Math.floor(timeLeft / 60)
            .toString()
            .padStart(2, "0")}
          :{(timeLeft % 60).toString().padStart(2, "0")}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {t("newPassword")}
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {t("confirmPassword")}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md relative text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden transition-all duration-300 ease-in-out"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            t("resetPassword")
          )}
        </motion.button>
      </form>

    </div>
  );
};

export default ResetPasswordForm;
