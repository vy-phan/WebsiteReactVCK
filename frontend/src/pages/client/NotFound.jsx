import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Meta from '../../components/Meta';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="grid h-screen place-content-center bg-white dark:bg-gray-800 px-4">
      <Meta
        title={t("notFoundMetaTitle")} // Sử dụng translation cho title
        description={t("notFoundMetaDescription")} // Sử dụng translation cho description
        keywords={t("notFoundMetaKeywords")} // Sử dụng translation cho keywords
      />
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200 dark:text-gray-400">404</h1>

        <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          {t('not_found.title')}
        </p>

        <p className="mt-4 text-gray-500 dark:text-gray-400">
          {t('not_found.message')}
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-sm bg-indigo-600 dark:bg-indigo-500 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-3 focus:outline-hidden"
        >
          {t('not_found.back_home')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;