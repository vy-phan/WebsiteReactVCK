import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiSun, FiMoon, FiUser } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuthContext } from '../../context/AuthContext';
import useLogout from '../../hooks/useLogout';
import Logo from '../Logo';
import VNFlag from '../../assets/VN.png';
import UKFlag from '../../assets/UK.png';

const AdminNavbar = ({ toggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { authUser } = useAuthContext();
  const { logout } = useLogout();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto ">
        <div className="relative flex items-center h-16 p-5 md:p-10 md:justify-center"> {/* Loại bỏ justify-center mặc định, thêm md:justify-center */}
          {/* Left side */}
          <div className="flex items-center md:absolute md:left-5"> {/* Loại bỏ absolute mặc định, thêm md:absolute md:left-5 */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiMenu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          {/* Logo */}
          <div className="flex-1 flex justify-start md:justify-center"> {/* Thêm justify-start cho mobile */}
            <Logo className="" />
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4 md:absolute md:right-5"> {/* Loại bỏ absolute mặc định, thêm md:absolute md:right-5 */}
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              title={isDarkMode ? t('lightMode') : t('darkMode')}
            >
              {isDarkMode ? (
                <FiSun className="h-5 w-5 text-yellow-500" />
              ) : (
                <FiMoon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-2 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <img
                  src={i18n.language === 'vi' ? VNFlag : UKFlag}
                  alt={i18n.language.toUpperCase()}
                  className="w-6 h-4"
                />
                <span>{i18n.language.toUpperCase()}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700">
                  <button
                    onClick={() => {
                      changeLanguage('vi');
                      setShowLangMenu(false);
                    }}
                    className="flex items-center justify-center bg-white dark:bg-gray-800 space-x-3 w-full px-5 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <img src={VNFlag} alt="VN" className="w-6 h-4" />
                    <span>VN</span>
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage('en');
                      setShowLangMenu(false);
                    }}
                    className="flex items-center justify-center bg-white dark:bg-gray-800 space-x-3 w-full px-5 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <img src={UKFlag} alt="UK" className="w-6 h-4" />
                    <span>EN</span>
                  </button>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center p-0 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {authUser?.avatarUrl ? (
                  <img
                    src={authUser.avatarUrl}
                    alt={authUser.username}
                    className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-400"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full border-2 border-gray-200 dark:border-gray-400 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                    <FiUser className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                  </div>
                )}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border dark:border-gray-700">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    {t('profileLink')}
                  </Link>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    {t('home')}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;