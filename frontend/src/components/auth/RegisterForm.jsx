// RegisterForm.js
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const RegisterForm = ({ onSwitchMode, onClose }) => { // Receive onClose prop
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { initiateSignup, loading: authLoading } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" }); // 'success' or 'error'
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: "error",
        content: t("passwordMismatch"),
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const success = await initiateSignup(formData);
      if (success) {
        // Lưu thời gian bắt đầu vào sessionStorage
        const now = Date.now();
        sessionStorage.setItem("verificationStartTime", now.toString());
        onSwitchMode("verify", {
          email: formData.email,
          username: formData.username
        });
        // onClose(); // Close modal after successful registration
      }
    } catch (error) {
      setMessage({
        type: "error",
        content: error.message || t("registerError"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage({ type: "", content: "" });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        {t("register")}
      </h2>

      {message.content && (
        <div
          className={`mb-4 p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.content}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {t("fullName")}
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900
               focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500 dark:bg-gray-800
               dark:border-gray-600 dark:text-white caret-blue-500 "
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {t("email")}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white caret-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {t("password")}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white caret-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {t("confirmPassword")}
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white caret-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            {t("gender")}
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
                className="form-radio h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-200">
                {t("male")}
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
                className="form-radio h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-200">
                {t("female")}
              </span>
            </label>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading || authLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md relative text-sm font-medium text-white
             ${
               message.type === "success"
                 ? "bg-green-600 hover:bg-green-700"
                 : "bg-gradient-to-r from-blue-500 to-purple-600"
             }
             overflow-hidden transition-all duration-300 ease-in-out
             shadow-md shadow-blue-500/50 hover:shadow-lg hover:shadow-purple-500/70
             hover:scale-105 hover:text-base
             before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full
             before:bg-white/20 before:skew-x-[-30deg] before:transition-all before:duration-500
             hover:before:left-[100%]`}
        >
          {isLoading || authLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            t("registerButton")
          )}
        </motion.button>

        <div className="mt-8 text-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t("haveAccount")}{" "}
          </span>
          <button
            onClick={() => onSwitchMode("login")}
            className="relative text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600
             overflow-hidden transition-all duration-300 ease-in-out
             shadow-md shadow-blue-500/50 hover:shadow-lg hover:shadow-purple-500/70
             hover:scale-105 hover:text-base
             before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full
             before:bg-white/20 before:skew-x-[-30deg] before:transition-all before:duration-500
             hover:before:left-[100%]"
          >
            {t("loginNow")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;