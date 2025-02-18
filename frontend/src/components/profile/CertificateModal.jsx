import React from 'react';
import { useTranslation } from 'react-i18next';

const CertificateModal = ({ 
    showModal, 
    selectedCourse, 
    onClose, 
    canvasRef, 
    drawCertificate, 
    downloadCertificate 
}) => {
    const { t } = useTranslation();

    if (!showModal || !selectedCourse) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-3xl w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t("profile.certificate_for_course", {
                            courseName: selectedCourse.nameCourse,
                        })}
                    </h3>
                    <button
                        onClick={onClose}
                        className="bg-gray-200 dark:bg-dark text-black dark:text-white hover:text-gray-400 hover:dark:text-blue-500 transition duration-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                    <div className="relative">
                        <img
                            src="/chungchi.jpg"
                            alt="Template"
                            className="w-full h-auto opacity-0 absolute"
                            onLoad={(e) => {
                                if (canvasRef.current) {
                                    canvasRef.current.width = e.target.naturalWidth;
                                    canvasRef.current.height = e.target.naturalHeight;
                                    drawCertificate();
                                }
                            }}
                        />
                        <canvas
                            ref={canvasRef}
                            className="w-full h-auto rounded-lg"
                            style={{ minHeight: "400px" }}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={downloadCertificate}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
                    >
                        <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {t("download")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CertificateModal;