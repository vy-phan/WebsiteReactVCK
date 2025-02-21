import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const NoteLesson = ({ courseId, lessonId, userData }) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    // Lấy danh sách ghi chú
    const fetchNotes = async () => {
        if (!userData?._id || !lessonId) {
            console.log('Missing required data for fetchNotes:', { 
                userId: userData?._id, 
                lessonId 
            });
            return;
        }
        try {
            const response = await axios.get(`/api/notes?lessonId=${lessonId}&userId=${userData._id}`);
            if (response.data.success) {
                setNotes(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching notes:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Không thể tải ghi chú');
        }
    };

    useEffect(() => {
        if (userData && lessonId) {
            // console.log('Fetching notes with:', { 
            //     userId: userData._id, 
            //     lessonId,
            //     courseId 
            // });
            fetchNotes();
        }
    }, [lessonId, userData]);

    // Thêm ghi chú mới
    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        // console.log('NoteLesson - Current state before adding note:', {
        //     userData,
        //     lessonId,
        //     courseId,
        //     newNote,
        //     userDataId: userData?._id
        // });

        if (!userData?._id || !lessonId || !courseId) {
            // console.log('NoteLesson - Missing required data:', {
            //     hasUserId: !!userData?._id,
            //     userId: userData?._id,
            //     hasLessonId: !!lessonId,
            //     lessonId,
            //     hasCourseId: !!courseId,
            //     courseId,
            //     fullUserData: userData
            // });
            toast.error('Thiếu thông tin cần thiết để thêm ghi chú');
            return;
        }

        setIsLoading(true);
        try {
            const noteData = {
                userId: userData._id,
                lessonId,
                courseId,
                content: newNote
            };
            console.log('NoteLesson - Sending note data:', noteData);

            const response = await axios.post('/api/notes', noteData);

            if (response.data.success) {
                setNotes([response.data.data, ...notes]);
                setNewNote('');
                toast.success('Thêm ghi chú thành công');
            }
        } catch (error) {
            console.error('Error adding note:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Không thể thêm ghi chú');
        } finally {
            setIsLoading(false);
        }
    };

    // Cập nhật ghi chú
    const handleUpdateNote = async (noteId) => {
        if (!editContent.trim()) return;

        setIsLoading(true);
        try {
            const response = await axios.patch(`/api/notes/${noteId}`, {
                content: editContent
            });

            if (response.data.success) {
                setNotes(notes.map(note => 
                    note._id === noteId ? response.data.data : note
                ));
                setEditingNote(null);
                setEditContent('');
                toast.success('Cập nhật ghi chú thành công');
            }
        } catch (error) {
            console.error('Error updating note:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Không thể cập nhật ghi chú');
        } finally {
            setIsLoading(false);
        }
    };

    // Xóa ghi chú
    const handleDeleteNote = async (noteId) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`/api/notes/${noteId}`);
            if (response.data.success) {
                setNotes(notes.filter(note => note._id !== noteId));
                toast.success('Xóa ghi chú thành công');
            }
        } catch (error) {
            console.error('Error deleting note:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Không thể xóa ghi chú');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (note) => {
        setEditingNote(note._id);
        setEditContent(note.content);
    };

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

    if (!userData || !lessonId || !courseId) {
        // console.log('Rendering login message due to missing data:', {
        //     hasUser: !!userData,
        //     hasLessonId: !!lessonId,
        //     hasCourseId: !!courseId,
        //     userData: userData
        // });
        return <div className="p-4 text-gray-500">Vui lòng đăng nhập để sử dụng tính năng ghi chú</div>;
    }

    return (
        <div className="mt-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{t('noteTitle')}</h3>

            {/* Form thêm ghi chú mới */}
            <form onSubmit={handleAddNote} className="mb-8">
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder={t('noteInput')}
                    className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                            placeholder-gray-400 dark:placeholder-gray-500
                            transition duration-200 ease-in-out"
                    rows="3"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="mt-3 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 
                            text-white font-medium rounded-lg
                            transition duration-200 ease-in-out
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !newNote.trim()}
                >
                    {isLoading ? 'Đang thêm...' : `${t('noteButton')}`}
                </button>
            </form>

            {/* Danh sách ghi chú */}
            <div className="space-y-6">
                {notes.map((note) => (
                    <div key={note._id} 
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm 
                                border border-gray-100 dark:border-gray-700 
                                p-6 transition duration-200 ease-in-out">
                        {editingNote === note._id ? (
                            <div className="space-y-4">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg 
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                            transition duration-200 ease-in-out"
                                    rows="3"
                                    disabled={isLoading}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdateNote(note._id)}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 
                                                text-white font-medium rounded-lg
                                                transition duration-200 ease-in-out
                                                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                                flex items-center gap-2"
                                        disabled={isLoading}
                                    >
                                        <FaSave /> {t('save')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingNote(null);
                                            setEditContent('');
                                        }}
                                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 
                                                text-white font-medium rounded-lg
                                                transition duration-200 ease-in-out
                                                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                                                flex items-center gap-2"
                                    >
                                        <FaTimes /> {t('cancel')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full 
                                                    flex items-center justify-center overflow-hidden
                                                    ring-2 ring-gray-100 dark:ring-gray-600">
                                            {userData?.avatarUrl ? (
                                                <img
                                                    src={userData.avatarUrl}
                                                    alt={userData.username || 'Avatar'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-gray-400 dark:text-gray-500 text-xl">
                                                    {userData?.username?.[0]?.toUpperCase() || userData?.email?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    {userData?.username || userData?.email?.split('@')[0] || 'User'}
                                                </h4>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {formatDate(note.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingNote(note._id);
                                                setEditContent(note.content);
                                            }}
                                            className="p-2 text-blue-600 bg-gray-200 dark:bg-dark  hover:text-blue-800 
                                                    transition duration-200 ease-in-out"
                                            disabled={isLoading}
                                            title={t('edit')}
                                        >
                                            <FaEdit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteNote(note._id)}
                                            className="p-2 text-red-600 bg-gray-200 dark:bg-dark hover:text-red-800
                                                    transition duration-200 ease-in-out"
                                            disabled={isLoading}
                                            title={t('delete')}
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {note.content}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {notes.length === 0 && (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                        {t('noteContent')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoteLesson;