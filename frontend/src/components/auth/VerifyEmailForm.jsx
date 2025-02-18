import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../context/AuthContext";

const VerifyEmailForm = ({ onSwitchMode, registrationData }) => {
  const { t } = useTranslation();
  const { completeSignup, loading } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const [verificationCode, setVerificationCode] = useState("");

  const [timeLeft, setTimeLeft] = useState(() => {
    const startTime = sessionStorage.getItem("verificationStartTime");
    if (!startTime) {
      const now = Date.now();
      sessionStorage.setItem("verificationStartTime", now.toString());
      return 300;
    }

    const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
    const remaining = 300 - elapsed;
    return remaining > 0 ? remaining : 0;
  });

  // Timer và điều hướng
  useEffect(() => {
    if (!registrationData || timeLeft <= 0) {
      sessionStorage.removeItem("verificationStartTime");
      onSwitchMode && onSwitchMode("register");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          sessionStorage.removeItem("verificationStartTime");
          onSwitchMode && onSwitchMode("register");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [registrationData, timeLeft, onSwitchMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      setMessage({
        type: "error",
        content: t("invalidVerificationCode"),
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const success = await completeSignup(
        registrationData.email,
        verificationCode
      );
      if (success) {
        setMessage({
          type: "success",
          content: t("verificationSuccess"),
        });
        setTimeout(() => {
          onSwitchMode && onSwitchMode("login");
        }, 2000);
      }
    } catch (error) {
      let errorMessage = t("verificationError");
      if (error.message === "No pending registration found") {
        errorMessage = t("noPendingRegistration");
      } else if (error.message === "Invalid verification code") {
        errorMessage = t("invalidVerificationCode");
      }
      setMessage({
        type: "error",
        content: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Định dạng thời gian
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        {t("verifyEmail")}
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

      {registrationData && (
        <div className="text-center mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {t("verificationCodeSent")}
          </p>
          <p className="font-medium text-gray-900 dark:text-white mt-2">
            {registrationData.email}
          </p>
          <p className="text-sm text-red-500 mt-2">
            {t("timeremaining")} {formatTime(timeLeft)}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {t("verificationCode")}
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md 
                      shadow-sm text-gray-900 text-center text-2xl tracking-[1em] font-bold
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                      dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="000000"
            maxLength={6}
            required
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading || loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md relative text-sm font-medium text-white
            bg-gradient-to-r from-blue-500 to-purple-600
            overflow-hidden transition-all duration-300 ease-in-out 
            shadow-md shadow-blue-500/50 hover:shadow-lg hover:shadow-purple-500/70 
            hover:scale-105 hover:text-base
            before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full 
            before:bg-white/20 before:skew-x-[-30deg] before:transition-all before:duration-500 
            hover:before:left-[100%]`}
        >
          {isLoading || loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            t("verifyButton")
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default VerifyEmailForm;
