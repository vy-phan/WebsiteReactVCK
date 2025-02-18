import React, { useState } from 'react'
import { FaCheckCircle, FaGraduationCap, FaUserGraduate, FaBriefcase } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext'; // Import AuthContext
import { useTranslation } from 'react-i18next';

const SelectLevel = () => {
    const { t } = useTranslation();
    const [selectedLevel, setSelectedLevel] = useState(null);
    const { authUser } = useAuthContext(); // Access authUser from context

    const levels = [
        {
            id: 'beginner',
            title: 'selectLevel_level_beginner',
            description: 'selectLevel_level_beginner_description',
            icon: FaGraduationCap,
            color: 'from-green-400 to-emerald-500',
        },
        {
            id: 'intermediate',
            title: 'selectLevel_level_intermediate',
            description: 'selectLevel_level_intermediate_description',
            icon: FaUserGraduate,
            color: 'from-blue-400 to-indigo-500',
        },
        {
            id: 'advanced',
            title: 'selectLevel_level_advanced',
            description: 'selectLevel_level_advanced_description',
            icon: FaBriefcase,
            color: 'from-purple-400 to-pink-500',
        }
    ];

    const handleSelectLevel = (levelId) => {
        setSelectedLevel(levelId === selectedLevel ? null : levelId);
    };

    const handleContinue = () => {
        if (selectedLevel && authUser) { // Ensure authUser is available
            // 1. Lấy giá trị hiện tại từ localStorage (với key 'userSelections')
            const storedSelectionsJSON = localStorage.getItem(`userSelections-${authUser._id}`); // User-specific key
            let storedSelections = [];

            // 2. Chuyển đổi từ JSON sang mảng (nếu có)
            if (storedSelectionsJSON) {
                storedSelections = JSON.parse(storedSelectionsJSON);
            }

            // Tìm xem đã có object level trong mảng chưa, nếu có thì update, không thì thêm mới
            const levelIndex = storedSelections.findIndex(item => item.level !== undefined);
            if (levelIndex > -1) {
                storedSelections[levelIndex] = { level: selectedLevel }; // Update level
            } else {
                storedSelections.push({ level: selectedLevel }); // Thêm level mới
            }


            // 4. Chuyển đổi mảng trở lại JSON
            const updatedSelectionsJSON = JSON.stringify(storedSelections);

            // 5. Lưu chuỗi JSON đã cập nhật vào localStorage với key 'userSelections'
            localStorage.setItem(`userSelections-${authUser._id}`, updatedSelectionsJSON); // User-specific key
        }
    };

    return (
        <div className="min-h-screen mt-14 bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('selectLevel_header')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('selectLevel_header_description')}
                    </p>
                </div>

                {/* Levels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {levels.map((level) => {
                        const Icon = level.icon;
                        const isSelected = selectedLevel === level.id;
                        return (
                            <div
                                key={level.id}
                                onClick={() => handleSelectLevel(level.id)}
                                className={`relative rounded-xl border ${isSelected ? 'border-blue-500 dark:border-blue-500' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer`}
                            >
                                {/* Checkbox Overlay - Thay đổi vị trí và kiểu dáng */}
                                <div className="absolute top-3 right-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'} transition-colors duration-200`}>
                                        {isSelected && <FaCheckCircle className="text-white text-xs" />}
                                    </div>
                                </div>

                                {/* Level Content */}
                                <div className="p-6">
                                    <div className="flex space-x-4">
                                        <div className={`p-2 rounded-md bg-gradient-to-br ${level.color} text-white`}>
                                            <Icon className="text-lg" />
                                        </div>
                                        <div>
                                            <h3 className={`text-lg font-semibold ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'} transition-colors duration-200`}>
                                                {t(level.title)}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {t(level.description)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* Thêm hiệu ứng border khi hover */}
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-500 transition-border duration-200 pointer-events-none"></div>
                            </div>
                        );
                    })}
                </div>

                {/* Selected Level Summary */}
                {(selectedLevel) && (
                    <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-gray-900 dark:text-white">
                                {selectedLevel && (
                                    <span>
                                        <span className="font-medium">{t('selectLevel_selectedLevel_prefix')}:</span> {t(levels.find(l => l.id === selectedLevel)?.title)}
                                    </span>
                                )}
                            </div>
                            <Link
                                to="/select-course"
                                className={`px-6 py-2 bg-blue-500 text-white rounded-lg transition-colors
                                    ${(selectedLevel)
                                        ? 'hover:bg-blue-600 cursor-pointer'
                                        : 'opacity-50 cursor-not-allowed'
                                    }`}
                                disabled={!selectedLevel}
                                onClick={handleContinue} // Thêm onClick handler để lưu vào local storage trước khi chuyển trang
                            >
                                {t('selectLevel_continueButton')}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SelectLevel