import React, { useState } from 'react';
import useGetCourse from '../../hooks/useGetCourse';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext'; // Import AuthContext
import { useTranslation } from 'react-i18next';

const SelectCourse = () => {
    const { t } = useTranslation();
    const { courses, error, loading } = useGetCourse();
    const [selectedCourses, setSelectedCourses] = useState([]);
    const { authUser } = useAuthContext(); // Access authUser from context


    const handleSelectCourse = (courseId) => {
        setSelectedCourses(prev => {
            if (prev.includes(courseId)) {
                return prev.filter(id => id !== courseId);
            }
            return [...prev, courseId];
        });
    };

    const handleContinue = () => {
        if (selectedCourses.length > 0 && authUser) { // Ensure authUser is available
            // 1. Lấy giá trị hiện tại từ localStorage (với key 'userSelections')
            const storedSelectionsJSON = localStorage.getItem(`userSelections-${authUser._id}`); // User-specific key
            let storedSelections = [];

            // 2. Chuyển đổi từ JSON sang mảng (nếu có)
            if (storedSelectionsJSON) {
                storedSelections = JSON.parse(storedSelectionsJSON);
            }

            // Tìm xem đã có object courses trong mảng chưa, nếu có thì update, không thì thêm mới
            const coursesIndex = storedSelections.findIndex(item => item.courses !== undefined);
            if (coursesIndex > -1) {
                storedSelections[coursesIndex] = { courses: selectedCourses }; // Update courses, replace the whole array of courses
            } else {
                storedSelections.push({ courses: selectedCourses }); // Thêm courses mới
            }


            // 4. Chuyển đổi mảng trở lại JSON
            const updatedSelectionsJSON = JSON.stringify(storedSelections);

            // 5. Lưu chuỗi JSON đã cập nhật vào localStorage với key 'userSelections'
            localStorage.setItem(`userSelections-${authUser._id}`, updatedSelectionsJSON); // User-specific key
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FaSpinner className="text-4xl text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold">{t('selectCourse_error_title')}</p>
                    <p className="text-sm mt-2">{t('selectCourse_error_description')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-14 bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('selectCourse_header')}
                    </h1>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses?.map((course) => (
                        <div
                            key={course._id}
                            className={`relative group rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl
                ${selectedCourses.includes(course._id) ? 'ring-2 ring-blue-500' : ''}
              `}
                        >
                            {/* Checkbox Overlay */}
                            <div className="absolute top-4 right-4 z-10">
                                <div
                                    onClick={() => handleSelectCourse(course._id)}
                                    className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center
                    ${selectedCourses.includes(course._id)
                                            ? 'bg-blue-500'
                                            : 'bg-white dark:bg-gray-700'
                                        }
                    border-2
                    ${selectedCourses.includes(course._id)
                                            ? 'border-blue-500'
                                            : 'border-gray-300 dark:border-gray-600'
                                        }
                  `}
                                >
                                    {selectedCourses.includes(course._id) && (
                                        <FaCheckCircle className="text-white" />
                                    )}
                                </div>
                            </div>

                            {/* Course Image */}
                            <div className="relative aspect-video">
                                <img
                                    src={course.imageCourse}
                                    alt={course.nameCourse}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                            </div>

                            {/* Course Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {course.nameCourse}
                                </h3>
                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                    <span>
                                        {t('selectCourse_courseCard_createdAt')}: {new Date(course.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                    <span>
                                        {t('selectCourse_courseCard_updatedAt')}: {new Date(course.updatedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Selected Courses Summary */}
                {(selectedCourses.length > 0) && (
                    <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-gray-900 dark:text-white">
                                {selectedCourses.length > 0 && (
                                    <span>
                                        <span className="font-medium">{selectedCourses.length}</span> {t('selectCourse_selectedCoursesCount')}
                                    </span>
                                )}
                            </div>
                            <Link
                                to="/shedule"
                                className={`px-6 py-2 bg-blue-500 text-white rounded-lg transition-colors
                  ${(selectedCourses.length > 0)
                                        ? 'hover:bg-blue-600 cursor-pointer'
                                        : 'opacity-50 cursor-not-allowed'
                                    }`}
                                disabled={selectedCourses.length === 0}
                                onClick={handleContinue} // Thêm onClick handler để lưu vào local storage trước khi chuyển trang
                            >
                                {t('selectCourse_continueButton')}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectCourse;