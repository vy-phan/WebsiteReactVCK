import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import VerifyEmailForm from "./VerifyEmailForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import { X, ChevronRight } from "lucide-react";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);
  const [registrationData, setRegistrationData] = useState(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState(null);
  const { t } = useTranslation();
  const dragX = useMotionValue(0);
  const dragProgress = useTransform(dragX, [0, 200], [1, 0]);
  const dragOpacity = useTransform(dragProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const dragScale = useTransform(dragProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleDragEnd = (_, info) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      setMode(mode === "login" ? "register" : "login");
    }
  };

  const handleSwitchMode = (newMode, data = null) => {
    if (newMode === "verify" && data) {
      setRegistrationData(data);
    } else if (newMode === "resetPassword" && data) {
      setForgotPasswordEmail(data);
    }
    setMode(newMode);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden my-8"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 bg-white/10 rounded-full z-10 transition-all duration-300"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-all duration-300 hover:text-blue-500" />
            </button>

            <div className="grid md:grid-cols-2 min-h-[600px] relative">
              {/* Illustration */}
              {mode === "verify" ? (
                <div className="hidden md:block bg-gradient-to-br from-blue-500 to-purple-600 p-8">
                  <div className="sticky top-8 h-full flex flex-col justify-center items-center text-white">
                    <h2 className="text-3xl font-bold mb-4">{t("welcome")}</h2>
                    <p className="text-center text-lg opacity-90">
                      {`${t("verifyMessage")} ${registrationData?.email}`}
                    </p>
                    <p className="mt-4 text-sm text-white/70">
                      {t("verifyInstruction")}
                    </p>
                  </div>
                </div>
              ) : (
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={handleDragEnd}
                  style={{ x: dragX }}
                  className="hidden md:block bg-gradient-to-br from-blue-500 to-purple-600 p-8 cursor-grab active:cursor-grabbing relative"
                >
                  <div className="absolute inset-y-0 -right-4 flex items-center">
                    <div className="p-1 rounded-full bg-white/10 backdrop-blur">
                      <ChevronRight className="w-5 h-5 text-white/70" />
                    </div>
                  </div>

                  <motion.div
                    // style={{ opacity: dragOpacity, scale: dragScale }}
                    className="sticky top-8 h-full flex flex-col justify-center items-center text-white"
                  >
                    <h2 className="text-3xl font-bold mb-4">{t("welcome")}</h2>
                    <p className="text-center text-lg opacity-90">
                      {mode === "login"
                        ? t("loginMessage")
                        : mode === "forgotPassword"
                        ? t("forgotPasswordMessage")
                        : t("registerMessage")}
                    </p>
                    <p className="mt-4 text-sm text-white/70">
                      {mode === "login"
                        ? t("dragToRegister")
                        : mode === "forgotPassword"
                        ? t("dragToLogin")
                        : t("dragToLogin")}
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {/* Form */}
              <div className="p-8 flex flex-col justify-center h-[700px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {mode === "login" && (
                      <LoginForm onSwitchMode={handleSwitchMode} onClose={onClose} />
                    )}
                    {mode === "register" && (
                      <RegisterForm onSwitchMode={handleSwitchMode} onClose={onClose} />
                    )}
                    {mode === "verify" && registrationData && (
                      <VerifyEmailForm
                        onSwitchMode={handleSwitchMode}
                        registrationData={registrationData}
                      />
                    )}
                    {mode === "forgotPassword" && (
                      <ForgotPasswordForm
                        onSwitchMode={handleSwitchMode}
                        onResetPassword={(email) => {
                          setForgotPasswordEmail(email);
                          handleSwitchMode("resetPassword");
                        }}
                      />
                    )}
                    {mode === "resetPassword" && (
                      <ResetPasswordForm
                        onSwitchMode={handleSwitchMode}
                        email={forgotPasswordEmail}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;