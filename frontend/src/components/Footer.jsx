import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaTwitter, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

const Footer = () => {
  const { t } = useTranslation();

  const menuItems = [
    { title: t('home'), path: '/' },
    { title: t('courses'), path: '/courses' },
    { title: t('ranking'), path: '/rank' },
    { title: t('about'), path: '/about' },
    { title: t('post'), path: '/post' },
    { title: t('p&l'), path: '/policy-and-legal' }
  ];

  const socialLinks = [
    { icon: <FaFacebook className="w-5 h-5" />, url: 'https://facebook.com' },
    { icon: <FaTwitter className="w-5 h-5" />, url: 'https://x.com' },
    { icon: <FaYoutube className="w-5 h-5" />, url: 'https://youtube.com' },
    { icon: <FaLinkedin className="w-5 h-5" />, url: 'https://linkedin.com' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('about_us')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {t('about_description')}
            </p>
          </div>

          {/* Categories Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('categories')}
            </h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('contact_info')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <HiLocationMarker className="w-5 h-5 text-gray-400 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('address_detail')}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <HiPhone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('phone_number')}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <HiMail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('email_address')}
                </span>
              </div>

              {/* Social Media Links */}
              <div className="pt-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  {t('follow_us')}
                </h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;