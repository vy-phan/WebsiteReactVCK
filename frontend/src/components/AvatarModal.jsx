// --- START OF FILE AvatarModal.jsx ---
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AvatarModal = ({ isOpen, onClose, onAvatarSelect }) => {
    const { t } = useTranslation();
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    if (!isOpen) {
        return null;
    }

    const avatarCount = 126;
    const avatars = Array.from({ length: avatarCount }, (_, i) => `/avatar/avt_${i + 1}.webp`);

    const handleAvatarClick = (avatarUrl) => {
        setSelectedAvatar(avatarUrl);
        onAvatarSelect(avatarUrl);
        onClose();
    };

    const handleAvatarHover = (avatarUrl) => {
        setSelectedAvatar(avatarUrl);
    };

    const handleAvatarMouseOut = () => {
        setSelectedAvatar(null);
    };

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"> {/* Thay items-end thành items-center */}
                {/* Background overlay */}
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                {/* Modal container */}
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-3xl sm:w-full"> {/* Loại bỏ sm:my-8 */}
                    <div className="bg-white dark:bg-gray-800 px-3 pt-4 pb-3 sm:p-4 sm:pb-3">
                        <div className="flex sm:items-start justify-center items-center">
                            <div className="mt-2 text-center sm:mt-0 sm:ml-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                    {t('choose_profile_picture')}
                                </h3>
                                <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                                    {avatars.map((avatar, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleAvatarClick(avatar)}
                                            onMouseOver={() => handleAvatarHover(avatar)}
                                            onMouseOut={handleAvatarMouseOut}
                                            className={`relative  bg-gradient-to-r from-blue-500 to-purple-600
                                                         overflow-hidden transition-all duration-300 ease-in-out
                                                         shadow-md shadow-blue-500/50 hover:shadow-lg hover:shadow-purple-500/70
                                                         hover:scale-105 hover:text-base
                                                         before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full
                                                         before:bg-white/20 before:skew-x-[-30deg] before:transition-all before:duration-500
                                                         hover:before:left-[100%] focus:outline-none p-0`} // Thêm className dài vào đây và focus:outline-none
                                        >
                                            <img
                                                src={avatar}
                                                alt={`Avatar ${index + 1}`}
                                                className={`w-24 h-24 rounded-xl object-cover border-2 border-transparent transition-all duration-200
                                                    ${selectedAvatar === avatar
                                                        ? 'border-blue-500 border-[4px] shadow-md'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                                                    }`
                                                } // Thay w-16 h-16 thành w-24 h-24
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 sm:px-4 sm:py-3 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="mt-2 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            {t('cancel')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarModal;
// --- END OF FILE AvatarModal.jsx ---