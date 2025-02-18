import React from 'react';
import { FaTimes } from "react-icons/fa";
import ChatBot from "./ChatBot"; 
import { useTranslation } from 'react-i18next';

const ChatbotWidget = ({ isMobileMenuOpen, isChatbotOpen, setIsChatbotOpen }) => {
  const { t } = useTranslation();
  return (
    <div className={`fixed bottom-16 right-4 z-50 lg:bottom-8 lg:right-8 ${isMobileMenuOpen ? 'lg:z-50' : 'z-50'}`}>
      <button
        className="bg-blue-500 text-white p-3 lg:p-5 rounded-full shadow-lg hover:bg-blue-600 transition-colors w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center relative"
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
      >
        {isChatbotOpen ? (
          <FaTimes size={24} lg:size={28} />
        ) : (
          <img
            src="/chatbot.jpg"
            alt="Chatbot Avatar"
            className="absolute top-0 left-0 w-full h-full rounded-full object-cover"
          />
        )}
      </button>

      {/* chatbot hiển thị khung chat */}
      {isChatbotOpen && (
        <div className="fixed top-16 right-4 lg:right-0 bg-white dark:bg-gray-900 rounded-lg shadow-xl z-50
                      flex flex-col w-[calc(100vw-2rem)] lg:w-3/12 h-[calc(100vh-100px)] lg:h-[calc(100vh-100px)]
                      border border-gray-200 dark:border-gray-700">
          <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100
                      dark:from-gray-800 dark:to-gray-900 rounded-t-lg border-b dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <img
                  src="/chatbot.jpg"
                  className="w-full h-full rounded-full object-cover ring-2 ring-white dark:ring-gray-700"
                  alt="CoNan Avatar"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-700"></div>
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-gray-900 dark:text-white">{t('chatTitle1')}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400"> {t('chatTitle2')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatbotOpen(false)}
              className="ml-auto -mt-9 -mr-6
                      text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300
                      bg-transparent outline-none focus:outline-none border-none"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* chatbot hiển thị khung chat */}
          <ChatBot />
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;