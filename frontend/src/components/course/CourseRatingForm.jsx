// --- START OF FILE CourseRatingForm.jsx ---
import React from 'react';
import { useState, useEffect } from 'react';
import { HiStar, HiOutlineStar } from "react-icons/hi2";
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CourseRatingForm = ({ courseName, instructorName, courseId, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const { t } = useTranslation();
    const [isDarkMode] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const { authUser } = useAuthContext();

    const handleStarClick = (ratingValue) => {
        setRating(ratingValue);
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <button
                    key={i}
                    type="button"
                    onClick={() => handleStarClick(i)}
                    className={`relative group focus:outline-none rounded-2xl transition-transform duration-300 bg-gray-200 dark:bg-gray-700 ${isDarkMode ? 'dark' : ''}`}
                >
                    {i <= rating ? (
                        <HiStar className="text-yellow-400 text-3xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 drop-shadow-glow" />
                    ) : (
                        <HiOutlineStar className="text-yellow-300 text-3xl transition-transform duration-300 group-hover:scale-110" />
                    )}

                    {i <= rating && (
                        <span className="absolute inset-0 rounded-full bg-yellow-300 opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300"></span>
                    )}

                    {i === rating && (
                        <span className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></span>
                    )}
                </button>
            );
        }
        return stars;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (submissionStatus === 'submitting') {
            return;
        }

        // Validation trước khi gửi request
        if (!authUser?._id) {
            toast.error(t('error_loginRequiredRating'));
            return;
        }
        if (!courseId) {
            toast.error(t('error_courseIdRequired'));
            return;
        }
        if (rating === 0) { // Kiểm tra rating === 0 (chưa chọn sao)
            toast.error(t('error_ratingRequired')); // Sử dụng key dịch thuật mới
            return;
        }
        if (rating < 1 || rating > 5) {
            toast.error(t('error_invalidRatingRange'));
            return;
        }


        setSubmissionStatus('submitting');

        const ratingData = {
            userId: authUser._id,
            courseId: courseId,
            rating: rating,
            // feedback: feedback, // Feedback hiện tại không được backend xử lý
        };

        const apiUrl = `/api/rating`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer YOUR_TOKEN_HERE`, // Thêm Authorization header nếu cần
                },
                body: JSON.stringify(ratingData),
            });

            if (!response.ok) {
                let errorMessage = `Lỗi HTTP: ${response.status}`;
                try {
                    const errorResponseData = await response.json();
                    if (errorResponseData && errorResponseData) {
                        errorMessage += ` - ${errorResponseData}`;
                    }
                } catch (jsonError) {
                    console.error("Không thể parse JSON lỗi response:", jsonError);
                }
                throw new Error(errorMessage);
            }

            const responseData = await response.json();
            // console.log('Đánh giá thành công:', responseData);
            setSubmissionStatus('success');
            // toast.success(t('success_ratingSubmitted'));
            onSubmit?.(responseData);
            onClose?.();

        } catch (error) {
            console.error('Lỗi gửi đánh giá:', error);
            setSubmissionStatus('error');
            toast.error(t('error_ratingSubmitFailed') + ': ' + error);
        } finally {
            setSubmissionStatus('idle');
        }
    };

    const handleCancel = () => {
        onClose?.();
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className={`bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md ${isDarkMode ? 'dark' : ''}`}>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">{t('courseRatingForm_title')}</h2>

                <div className="mb-6 text-gray-700 dark:text-gray-300">
                    <p className=" font-semibold mb-2">{t('courseRatingForm_courseInfo')}:</p>
                    <p className=""><span className="font-medium ">{t('courseRatingForm_courseName')}:</span> {courseName}</p>
                    <p className=""><span className="font-medium ">{t('courseRatingForm_instructorName')}:</span> {instructorName}</p>
                </div>

                <div className="mb-8 text-gray-700 dark:text-gray-300">
                    <p className=" font-semibold mb-3">{t('courseRatingForm_generalRating')}:</p>
                    <p className=" mb-2">{t('courseRatingForm_generalRatingQuestion')}</p>
                    <div className="flex items-center space-x-2">
                        {renderStars()}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                        {rating === 1 ? `(${t('ratingScale_veryBad')})` :
                            rating === 2 ? `(${t('ratingScale_bad')})` :
                                rating === 3 ? `(${t('ratingScale_average')})` :
                                    rating === 4 ? `(${t('ratingScale_good')})` :
                                        rating === 5 ? `(${t('ratingScale_veryGood')})` : ''}
                    </p>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors duration-200"
                        onClick={handleCancel}
                    >
                        {t('button_cancel')}
                    </button>
                    <button
                        type="submit"
                        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${submissionStatus === 'submitting' ? 'opacity-50 cursor-wait' : ''}`}
                        onClick={handleSubmit}
                        disabled={submissionStatus === 'submitting'}
                    >
                        {submissionStatus === 'submitting' ? t('button_submitting') : t('button_submitRating')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseRatingForm;
// --- END OF FILE CourseRatingForm.jsx ---