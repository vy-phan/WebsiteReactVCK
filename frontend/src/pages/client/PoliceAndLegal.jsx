import React from 'react'
import { useTranslation } from 'react-i18next';
import Meta from '../../components/meta';

const PoliceAndLegal = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <Meta
        title={t("policiesMetaTitle")} // Sử dụng translation cho title
        description={t("policiesMetaDescription")} // Sử dụng translation cho description
        keywords={t("policiesMetaKeywords")} // Sử dụng translation cho keywords
      />
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100"> {/* Dark mode text color */}
            {t('policyAndLegalPageTitle')}
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 dark:text-gray-100"> {/* Dark mode text color for heading */}
              {t('termsOfServiceTitle')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed"> {/* Dark mode text color */}
              {t('termsOfServiceContent')}
            </p>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2"> {/* Dark mode text color for subheading */}
              {t('termsOfServicePointsTitle')}
            </h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300"> {/* Dark mode text color for list items */}
              <li>{t('termsOfServicePoint1')}</li>
              <li>{t('termsOfServicePoint2')}</li>
              <li>{t('termsOfServicePoint3')}</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 dark:text-gray-100"> {/* Dark mode text color for heading */}
              {t('privacyPolicyTitle')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed"> {/* Dark mode text color */}
              {t('privacyPolicyContent')}
            </p>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2"> {/* Dark mode text color for subheading */}
              {t('privacyPolicyPointsTitle')}
            </h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300"> {/* Dark mode text color for list items */}
              <li>{t('privacyPolicyPoint1')}</li>
              <li>{t('privacyPolicyPoint2')}</li>
              <li>{t('privacyPolicyPoint3')}</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 dark:text-gray-100"> {/* Dark mode text color for heading */}
              {t('copyrightPolicyTitle')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed"> {/* Dark mode text color */}
              {t('copyrightPolicyContent')}
            </p>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2"> {/* Dark mode text color for subheading */}
              {t('copyrightPolicyPointsTitle')}
            </h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300"> {/* Dark mode text color for list items */}
              <li>{t('copyrightPolicyPoint1')}</li>
              <li>{t('copyrightPolicyPoint2')}</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 dark:text-gray-100"> {/* Dark mode text color for heading */}
              {t('disclaimerTitle')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed"> {/* Dark mode text color */}
              {t('disclaimerContent')}
            </p>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2"> {/* Dark mode text color for subheading */}
              {t('disclaimerPointsTitle')}
            </h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300"> {/* Dark mode text color for list items */}
              <li>{t('disclaimerPoint1')}</li>
              <li>{t('disclaimerPoint2')}</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 dark:text-gray-100"> {/* Dark mode text color for heading */}
              {t('contactUsTitle')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed"> {/* Dark mode text color */}
              {t('contactUsContent')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PoliceAndLegal