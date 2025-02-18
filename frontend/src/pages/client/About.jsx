import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Meta from "../../components/meta";

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Meta
        title={t("aboutUsMetaTitle")} // Sử dụng translation cho title
        description={t("aboutUsMetaDescription")} // Sử dụng translation cho description
        keywords={t("aboutUsMetaKeywords")} // Sử dụng translation cho keywords
      />
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <h2 className="mt-6 py-4 text-center text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600">
            {/* Gradient Text - Dark mode styling removed */}
            {t("aboutUsTitle")}
          </h2>
          <p className="mt-2 text-center text-lg text-gray-600 dark:text-gray-400 font-light">
            {/* Increased font-size, lighter weight */}
            {t("aboutUsSubtitle")}
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            {/* Increased padding */}
            <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-5">
              {/* Highlighted heading color, increased margin */}
              {t("aboutCVKHeading")}
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {/* Increased font-size, leading */}
              {t("aboutCVKContent")}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            {/* Increased padding */}
            <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-5">
              {/* Highlighted heading color, increased margin */}
              {t("learnReactHeading")}
            </h3>
            <div> {/* Bọc đoạn văn và danh sách trong div */}
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {/* Increased font-size, leading */}
                {t("learnReactContent")}
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                {/* Increased margin and spacing in list */}
                <li>
                  <span className=" text-gray-900 dark:text-gray-100">
                    {t("learnReactList1")}
                  </span>
                </li>
                {/* Emphasized list item text */}
                <li>
                  <span className=" text-gray-900 dark:text-gray-100">
                    {t("learnReactList2")}
                  </span>
                </li>
                {/* Emphasized list item text */}
                <li>
                  <span className=" text-gray-900 dark:text-gray-100">
                    {t("learnReactList3")}
                  </span>
                </li>
                {/* Emphasized list item text */}
                <li>
                  <span className=" text-gray-900 dark:text-gray-100">
                    {t("learnReactList4")}
                  </span>
                </li>
                {/* Emphasized list item text */}
              </ul>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"> {/* Thêm <p> bọc commitment */}
                {t("learnReactCommitment")}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            {/* Increased padding */}
            <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-5">
              {/* Highlighted heading color, increased margin */}
              {t("aiLearningHeading")}
            </h3>
            <div> {/* Bọc đoạn văn và danh sách trong div */}
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {/* Increased font-size, leading */}
                {t("aiLearningContent")}
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                {/* Increased margin and spacing in list */}
                <li>
                  <span className="  dark:text-white">
                    {t("aiLearningList1")}
                  </span>
                </li>
                {/* Highlighted feature name */}
                <li>
                  <span className="  dark:text-white">
                    {t("aiLearningList2")}
                  </span>
                </li>
                {/* Highlighted feature name */}
                <li>
                  <span className="  dark:text-white">
                    {t("aiLearningList3")}
                  </span>
                </li>
                {/* Highlighted feature name */}
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            {/* Increased padding */}
            <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-5">
              {/* Highlighted heading color, increased margin */}
              {t("progressTrackingHeading")}
            </h3>
            <div> {/* Bọc đoạn văn và danh sách trong div */}
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {/* Increased font-size, leading */}
                {t("progressTrackingContent")}
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                {/* Increased margin and spacing in list */}
                <li>
                  <span className="  dark:text-white">
                    {t("progressTrackingList1")}
                  </span>
                </li>
                {/* Highlighted feature name */}
                <li>
                  <span className="  dark:text-white">
                    {t("progressTrackingList2")}
                  </span>
                </li>
                {/* Highlighted feature name */}
                <li>
                  <span className="  dark:text-white">
                    {t("progressTrackingList3")}
                  </span>
                </li>
                {/* Highlighted feature name */}
              </ul>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-5">
              {t("startLearningCTA")}
            </p>
            <Link to="/courses">
              <button
                className="relative text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600
                        py-3 px-6 rounded-lg
                        overflow-hidden transition-all duration-300 ease-in-out
                        shadow-md shadow-blue-500/50 hover:shadow-lg hover:shadow-purple-500/70
                        hover:scale-105
                        before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full
                        before:bg-white/20 before:skew-x-[-30deg] before:transition-all before:duration-500
                        hover:before:left-[100%] mt-4"
              >
                {t("exploreCoursesButton")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;