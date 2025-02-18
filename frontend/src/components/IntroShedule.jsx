import React from 'react';
import {
  FaArrowDown,
  FaCheckCircle,
  FaCalendarAlt,
  FaChartLine,
  FaGraduationCap
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Meta from './meta';

const IntroSchedule = ({ handleShowCalendar }) => {
  const { t } = useTranslation();

  // Custom hover effect for feature cards
  const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <div className="group relative p-6 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <div className="flex items-center mb-4 space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg transform group-hover:scale-110 transition-transform duration-300">
            <Icon className="text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {t(title)}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {t(description)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Meta
        title={t("learningPathsMetaTitle")} // Sử dụng translation cho title
        description={t("learningPathsMetaDescription")} // Sử dụng translation cho description
        keywords={t("learningPathsMetaKeywords")} // Sử dụng translation cho keywords
      />
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="relative">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">
              {t('introSchedule_hero_badge')}
            </span>
            <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {t('introSchedule_hero_title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              {t('introSchedule_hero_description')}
            </p>

          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <FeatureCard
            icon={FaGraduationCap}
            title="introSchedule_featureCard1_title"
            description="introSchedule_featureCard1_description"
          />
          <FeatureCard
            icon={FaCalendarAlt}
            title="introSchedule_featureCard2_title"
            description="introSchedule_featureCard2_description"
          />
          <FeatureCard
            icon={FaChartLine}
            title="introSchedule_featureCard3_title"
            description="introSchedule_featureCard3_description"
          />
          <FeatureCard
            icon={FaCheckCircle}
            title="introSchedule_featureCard4_title"
            description="introSchedule_featureCard4_description"
          />
        </div>


        {/* CTA Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
          <div className="relative">
            <Link to="/select-level"
              onClick={handleShowCalendar}
              className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <FaArrowDown className="mr-2 group-hover:animate-bounce" />
              {t('introSchedule_cta_button')}
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
              {t('introSchedule_cta_description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSchedule;