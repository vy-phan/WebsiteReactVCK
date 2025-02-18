import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiSun, FiMoon, FiMenu, FiUser } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import '../i18n';
import Logo from './Logo';
import VNFlag from '../assets/VN.png';
import UKFlag from '../assets/UK.png';
import AuthModal from './auth/AuthModal';
import { useAuthContext } from '../context/AuthContext';
import useLogout from '../hooks/useLogout';
import SearchNavbar from './SearchNavbar';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { authUser } = useAuthContext();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { logout } = useLogout();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDarkMode = toggleTheme;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const menuItems = [
    { title: t('home'), path: '/' },
    { title: t('courses'), path: '/courses' },
    { title: t('ranking'), path: '/rank' },
    // { title: t('about'), path: '/about' },
    { title: t('post'), path: '/post' },

  ];

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo />

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:block flex-1 max-w-md mx-4">
              {/* <div className="relative">
                <input
                  type="text"
                  placeholder={t('search')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FiSearch className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div> */}
              <SearchNavbar />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.title}
                </Link>
              ))}
            </div>

            {/* Right Side Items */}
            <div className="flex items-center md:space-x-4 gap-2 md:gap-0">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-1.5 md:p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700"
                title={isDarkMode ? t('lightMode') : t('darkMode')}
              >
                {isDarkMode ? (
                  <FiSun className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
                ) : (
                  <FiMoon className="h-4 w-4 md:h-5 md:w-5 text-gray-600 " />
                )}
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-800 text-sm md:text-base text-gray-600 dark:text-gray-300 rounded-lg px-1 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[80px] justify-center"
                >
                  <img
                    src={i18n.language === 'vi' ? VNFlag : UKFlag}
                    alt={i18n.language.toUpperCase()}
                    className="w-6 h-4"
                  />
                  <span>{i18n.language.toUpperCase()}</span>
                </button>

                {showLangMenu && (
                  <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700 min-w-[120px]">
                    <button
                      onClick={() => {
                        changeLanguage('vi');
                        setShowLangMenu(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-1 text-left text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <img src={VNFlag} alt="VN" className="w-6 h-4" />
                      <span>VN</span>
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('en');
                        setShowLangMenu(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-1 text-left text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <img src={UKFlag} alt="UK" className="w-6 h-4" />
                      <span>EN</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Auth Buttons / User Profile */}
              {authUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center rounded-full bg-white dark:bg-gray-900 focus:outline-none hover:opacity-80 transition-opacity p-0.5"
                  >
                    {authUser.avatarUrl ? (
                      <img
                        src={authUser.avatarUrl}
                        alt={authUser.username}
                        className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-400"
                      />
                    ) : (
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-gray-200 dark:border-gray-400 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                        <FiUser className="h-6 w-6 md:h-7 md:w-7 text-gray-500 dark:text-gray-300" />
                      </div>
                    )}
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border dark:border-gray-700">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:dark:text-dark"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        {t('profileLink')}
                      </Link>
                      {
                        authUser.role === 'admin' || authUser.role === 'creator' ? (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            {t('admin')}
                          </Link>
                        ) : (
                          ''
                        )
                      }
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
              ) : (
                <div className="space-x-2 flex">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-0.5 md:px-4 py-2.5 bg-white text-xs md:text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {t('login')}
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="hidden md:inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {t('register')}
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isMenuOpen ? (
                  <IoClose className="h-5 w-5" />
                ) : (
                  <FiMenu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          console.log("Navbar - onClose function called!");
          setIsAuthModalOpen(false);
        }}
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;