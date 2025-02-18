import React from 'react';
import { Link } from 'react-router-dom';
import { FiGrid, FiBook, FiUser, FiEdit } from 'react-icons/fi';
import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ isOpen, toggleSidebar }) => { // Nhận prop toggleSidebar
  const { authUser } = useAuthContext();
  const { t } = useTranslation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <FiGrid className="w-5 h-5" />,
      path: '/admin/dashboard'
    },
    {
      title: t('adminCourse'),
      icon: <FiBook className="w-5 h-5" />,
      path: '/admin/courses'
    },
    {
      title: t('adminPost'),
      icon: <FiEdit className="w-5 h-5" />,
      path: '/admin/posts'
    }
  ];

  if (authUser?.role === 'admin') {
    menuItems.push({
      title: t('adminUser'),
      icon: <FiUser className="w-5 h-5" />,
      path: '/admin/users'
    });
  }

  return (
    <div
      className={`fixed left-0 top-16 h-full bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64`}
    >
      <div className="py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={toggleSidebar} // Gọi toggleSidebar khi click
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;