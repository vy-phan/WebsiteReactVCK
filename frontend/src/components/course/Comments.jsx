import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUser, FaTrash } from 'react-icons/fa';
import useGetLessons from '../../hooks/useGetLesson';
import useGetAllCourses from '../../hooks/useGetAllCourse';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';

const Comments = ({ courseId, lessonId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { authUser, loading } = useContext(AuthContext);
    const { lessons } = useGetLessons();
    const [selectedLessonIndex, setSelectedLessonIndex] = useState('all');
    const { courses } = useGetAllCourses();
    const { t } = useTranslation();


    // Sửa lại useEffect để tránh vòng lặp vô hạn
    useEffect(() => {
        // console.log("Comments.jsx - authUser changed, forcing re-render");
    }, [authUser]);

    // Tách fetchComments ra khỏi component hoặc sử dụng useCallback
    const fetchComments = useCallback(async () => {
        try {
            const response = await axios.get(`/api/comment/course/${courseId}`);
            setComments(response.data.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Không thể tải bình luận');
        }
    }, [courseId]);

    // Sửa lại useEffect cho fetchComments
    useEffect(() => {
        if (courseId) {
            fetchComments();
        }
    }, [courseId]); // Thêm fetchComments vào dependencies nếu cần

    // Add new comment
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            toast.error('Vui lòng nhập nội dung bình luận');
            return;
        }

        if (!authUser?._id) {
            console.error('User ID not found:', authUser);
            toast.error('Không thể xác định người dùng');
            return;
        }

        if (!lessonId) {
            console.error('Lesson ID not provided');
            toast.error('Không thể xác định bài học');
            return;
        }

        try {
            // console.log('Sending comment data:', {
            //     userId: authUser._id,
            //     courseId,
            //     lessonId,
            //     content: newComment
            // });

            const response = await axios.post('/api/comment', {
                userId: authUser._id,
                courseId,
                lessonId,
                content: newComment
            });
            // console.log('Response:', response.data);
            setComments([response.data.data, ...comments]);
            setNewComment('');
            toast.success('Đã thêm bình luận');
        } catch (error) {
            console.error('Error posting comment:', error.response?.data || error);
            toast.error('Không thể thêm bình luận');
        }
    }, [authUser?._id, courseId, lessonId, newComment, comments]);

    // Delete comment
    const handleDelete = useCallback(async (commentId) => {
        try {
            await axios.delete(`/api/comment/${commentId}`);
            setComments(comments.filter(comment => comment._id !== commentId));
            toast.success('Đã xóa bình luận');
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Không thể xóa bình luận');
        }
    }, [comments]);

    // Format date
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };



    const courseLessons = useMemo(() => {
        return lessons?.filter((lesson) => lesson.courseId === courseId) || [];
    }, [lessons, courseId]);

    // console.log("Course ",  courseLessons);

    const filteredComments = useMemo(() => {
        return comments.filter(comment => {
            if (selectedLessonIndex === 'all') return true;

            const selectedLesson = courseLessons[parseInt(selectedLessonIndex)]; // Lấy bài học đã chọn từ courseLessons

            if (!selectedLesson) {
                return false; // Nếu không tìm thấy bài học (ví dụ index không hợp lệ), không hiển thị comment này
            }

            return comment.lessonId === selectedLesson._id; // So sánh comment.lessonId với _id của bài học đã chọn
        });
    }, [comments, selectedLessonIndex, courseLessons]);

    // Render có điều kiện phần bình luận dựa vào 'loading' và 'authUser'
    if (loading) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="mt-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{t('commentTitle')}</h3>

            {/* Thêm dropdown để lọc bài học */}
            <div className="mb-6">
                <select
                    value={selectedLessonIndex}
                    onChange={(e) => setSelectedLessonIndex(e.target.value)}
                    className="w-full md:w-auto px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                    <option value="all">{t('commentSelect1')}</option>
                    {courseLessons?.map((lesson, index) => ( // ĐÃ SỬA: dùng courseLessons ở đây
                        <option key={lesson._id} value={index}>
                            {t('commentSelect2')} {index + 1}
                        </option>
                    ))}
                </select>
            </div>

            {/* Hiển thị thông báo khi chưa chọn bài học */}
            {!lessonId ? (
                <div className="mb-8 p-4 bg-yellow-50 dark:bg-gray-800 rounded-lg border border-yellow-200 dark:border-gray-700">
                    <p className="text-yellow-600 dark:text-yellow-400 text-center">
                        Vui lòng chọn một bài học để bình luận
                    </p>
                </div>
            ) : authUser ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={t('commentInput')}
                        className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                placeholder-gray-400 dark:placeholder-gray-500
                                transition duration-200 ease-in-out"
                        rows="3"
                    />
                    <button
                        type="submit"
                        className="mt-3 px-6 py-2.5 bg-blue-600 hover:bg-blue-700
                                text-white font-medium rounded-lg
                                transition duration-200 ease-in-out
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!newComment.trim()}
                    >
                        {t('commentButton')}
                    </button>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                        Vui lòng đăng nhập để bình luận
                    </p>
                </div>
            )}

            {/* Comments list */}
            {lessonId ? (
                <div className="space-y-6">
                    {filteredComments.map((comment) => (
                        <div key={comment._id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm
                                    border border-gray-100 dark:border-gray-700
                                    p-6 transition duration-200 ease-in-out">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full
                                                flex items-center justify-center overflow-hidden
                                                ring-2 ring-gray-100 dark:ring-gray-600">
                                        {comment.userId?.avatarUrl ? (
                                            <img
                                                src={comment.userId.avatarUrl}
                                                alt={comment.userId.username}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaUser className="text-gray-400 dark:text-gray-500 text-xl" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {comment.userId?.username || 'Người dùng'}
                                            </h4>
                                            {comment.userId?.role === 'admin' && (
                                                <span className="px-2.5 py-1 text-xs font-medium bg-red-100 dark:bg-red-900
                                                            text-red-600 dark:text-red-200 rounded-full">
                                                    Admin
                                                </span>
                                            )}
                                            {comment.userId?.role === 'creator' && (
                                                <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900
                                                            text-blue-600 dark:text-blue-200 rounded-full">
                                                    {t('commentAuthor')}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {formatDate(comment.createdAt)}
                                        </p>
                                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                            {comment.lessonId ? `${t('commentSelect2')} ${lessons?.findIndex(le => le._id === comment.lessonId) + 1}` : 'Không xác định'}
                                        </p>
                                    </div>
                                </div>
                                {(authUser?._i === comment.userId?._id || authUser?.role === 'admin') && (
                                    <button
                                        onClick={() => handleDelete(comment._id)}
                                        className="text-gray-400 hover:text-red-500 dark:text-gray-500
                                                dark:hover:text-red-400 transition-colors duration-200
                                                bg-transparent border-none outline-none focus:outline-none pr-0 pt-0"
                                        title={t('commentButtonTitle')}
                                    >
                                        <FaTrash className="text-lg" />
                                    </button>
                                )}
                            </div>
                            <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        </div>
                    ))}
                    {filteredComments.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">
                                {selectedLessonIndex === 'all'
                                    ? t('commentContent1')
                                    : `${t('commentContent2')} ${parseInt(selectedLessonIndex) + 1}`
                                }
                            </p>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default Comments;