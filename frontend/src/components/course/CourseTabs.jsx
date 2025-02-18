import React from 'react';
import { marked } from "marked";
import { useTheme } from '../../context/ThemeContext';
import NoteLesson from './NoteLesson.jsx';
import Comments from './Comments.jsx';
import { useTranslation } from 'react-i18next';

const CourseTabs = ({ selectedLesson, course, courseId, userData, activeTab, setActiveTab }) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <div>
      {/* Nút Tab nè */}
      <div className="flex overflow-x-auto scrollbar-hidden whitespace-nowrap border-b-2 dark:border-gray-700 border-gray-900">
        {/* nút giới thiệu  */}
        <button
          onClick={() => setActiveTab('introduce')}
          className={`py-3 px-6 relative font-medium text-base border-none outline-none focus:outline-none bg-transparent ${activeTab === 'introduce'
            ? 'text-black dark:text-white'
            : 'text-gray-400'
            }`}
        >
          {t('courseTab1')}
          <div
            className={`absolute bottom-[-2px] left-0 w-full h-[2px] bg-white transition-transform duration-300 ${activeTab === 'introduce' ? 'scale-x-100' : 'scale-x-0'
              }`}
          ></div>
        </button>

        {/* nút tổng quan  */}
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-6 relative font-medium text-base border-none outline-none focus:outline-none bg-transparent ${activeTab === 'overview'
            ? 'text-black dark:text-white'
            : 'text-gray-400'
            }`}
        >
          {t('courseTab2')}
          <div
            className={`absolute bottom-[-2px] left-0 w-full h-[2px] bg-white transition-transform duration-300 ${activeTab === 'overview' ? 'scale-x-100' : 'scale-x-0'
              }`}
          ></div>
        </button>

        {/* nút bình luận  */}
        <button
          onClick={() => setActiveTab('comments')}
          className={`py-3 px-6 relative font-medium text-base border-none outline-none focus:outline-none bg-transparent ${activeTab === 'comments'
            ? 'text-black dark:text-white'
            : 'text-gray-400'
            }`}
        >
           {t('courseTab3')}
          <div
            className={`absolute bottom-[-2px] left-0 w-full h-[2px] bg-white transition-transform duration-300 ${activeTab === 'comments' ? 'scale-x-100' : 'scale-x-0'
              }`}
          ></div>
        </button>

        {/* nút ghi chú  */}
        <button
          onClick={() => setActiveTab('notes')}
          className={`py-3 px-6 relative font-medium text-base border-none outline-none focus:outline-none bg-transparent ${activeTab === 'notes'
            ? 'text-black dark:text-white'
            : 'text-gray-400'
            }`}
        >
           {t('courseTab4')}
          <div
            className={`absolute bottom-[-2px] left-0 w-full h-[2px] bg-white transition-transform duration-300 ${activeTab === 'notes' ? 'scale-x-100' : 'scale-x-0'
              }`}
          ></div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* hiển thị Giới thiệu */}
        <div className={`transition-opacity duration-300 ${activeTab === 'introduce' ? 'opacity-100 visible' : 'opacity-0 invisible h-0'}`}>
          {selectedLesson && (
            <div className="max-w-4xl mx-auto">
              <div
                className="text-lg dark:text-gray-300 text-black text-justify"
                dangerouslySetInnerHTML={{ __html: marked.parse(selectedLesson?.description) }}
              />
            </div>
          )}
        </div>

        {/* hiển thị Tổng quan */}
        <div className={`transition-opacity duration-300 ${activeTab === 'overview' ? 'opacity-100 visible' : 'opacity-0 invisible h-0'}`}>
          {course && (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-4 dark:text-gray-100 text-black">
                {course.nameCourse}
              </h1>
              <div
                className="text-lg dark:text-gray-300 text-black"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>
          )}
        </div>

        {/* hiển thị Comment */}
        <div className={`transition-opacity duration-300 ${activeTab === 'comments' ? 'opacity-100 visible' : 'opacity-0 invisible h-0'}`}>
          <div className="max-w-4xl mx-auto">
            <Comments courseId={courseId} lessonId={selectedLesson?._id} />
          </div>
        </div>

        {/* hiển thị Thêm ghi chú */}
        <div className={`transition-opacity duration-300 ${activeTab === 'notes' ? 'opacity-100 visible' : 'opacity-0 invisible h-0'}`}>
          <div className="max-w-4xl mx-auto">
            {selectedLesson && userData ? (
              <NoteLesson courseId={courseId} lessonId={selectedLesson._id} userData={userData} />
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                {!selectedLesson
                  ? 'Vui lòng chọn một bài học để thêm ghi chú'
                  : !userData
                    ? 'Vui lòng đăng nhập để sử dụng tính năng ghi chú'
                    : 'Đang tải...'
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseTabs;