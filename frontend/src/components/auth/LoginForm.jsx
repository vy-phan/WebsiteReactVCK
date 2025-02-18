// LoginForm.js
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import useLogin from "../../hooks/useLogin";

const LoginForm = ({ onSwitchMode }) => { 
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const data = await login(formData);
      if (data) { 
        setMessage({ type: "success", content: t("loginSuccess") });
        setFormData({ email: "", password: "" });
        window.location.href = "/";
      }
    } catch (error) {
      setMessage({ type: "error", content: error.message || t("loginError") });
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
        {t("login")}
      </h2>

      {message.content && (
        <div
          className={`mb-4 p-4 rounded-md ${message.type === "success"
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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded
               dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-400"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-200">
              {t("rememberMe")}
            </label>
          </div>

          <button
            type="button"
            onClick={() => onSwitchMode('forgotPassword')}
            className="relative text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600
             overflow-hidden transition-all duration-300 ease-in-out
             shadow-md shadow-blue-500/50 hover:shadow-lg hover:shadow-purple-500/70
                 hover:scale-105 hover:text-base
             before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full
             before:bg-white/20 before:skew-x-[-30deg] before:transition-all before:duration-500
             hover:before:left-[100%]"
          >
            {t('forgotPassword')}
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md relative text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600
             overflow-hidden transition-all duration-300 ease-in-out
             shadow-md shadow-blue-500/50 hover:shadow-lg hover:shadow-purple-500/70
             hover:scale-105 hover:text-base
             before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full
             before:bg-white/20 before:skew-x-[-30deg] before:transition-all before:duration-500
             hover:before:left-[100%]"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            t("loginButton")
          )}
        </motion.button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        {t("noAccount")}{" "}
        <button
          onClick={() => onSwitchMode("register")}
          className="relative text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600
             overflow-hidden transition-all duration-300 ease-in-out
             shadow-md shadow-blue-500/50 hover:shadow-lg hover:shadow-purple-500/70
             hover:scale-105 hover:text-base
             before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full
             before:bg-white/20 before:skew-x-[-30deg] before:transition-all before:duration-500
             hover:before:left-[100%]"
        >
          {t("registerNow")}
        </button>
      </p>
    </div>
  );
};

export default LoginForm;