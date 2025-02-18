import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiArrowLeftCircle } from 'react-icons/fi';
import useGetLessons from '../../hooks/useGetLessons';
import useGetCourse from '../../hooks/useGetCourse';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import SimpleRichTextEditor from '../../components/SimpleRichTextEditor';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import paginateArray from '../../utils/paginateArray';
import Pagination from '../../components/Pagination'; // Import Pagination component
import { useTranslation } from 'react-i18next';

const AdminLessons = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const { courses } = useGetCourse();
  const { lessons, loading, error, setLessons } = useGetLessons(courseId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    nameLesson: '',
    videoUrl: '',
    description: '',
    timeVideo: '00:00'
  });
  const [forceUpdate, setForceUpdate] = useState({});

  const currentCourse = courses.find(course => course._id === courseId);

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const lessonsPerPage = 10; // Số bài học trên mỗi trang

  // Phân trang lessons
  const paginatedLessons = paginateArray(lessons || [], lessonsPerPage);
  const currentLessons = paginatedLessons[currentPage - 1] || [];
  const totalPages = paginatedLessons.length;


  const handleDelete = async (lessonId) => {
    if (window.confirm(t('adminLessons_deleteConfirmation'))) {
      try {
        await axios.delete(`/api/lesson/${lessonId}`);
        toast.success(t('adminLessons_deleteSuccess'));
        window.location.reload();
      } catch (error) {
        toast.error(t('adminLessons_deleteError'));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const lessonData = {
        ...formData,
        courseId,
        nameLesson: formData.nameLesson || `${t('adminLessons_defaultLessonNamePrefix')} ${Array.isArray(lessons) ? lessons.length + 1 : 1}`
      };

      if (editingLesson) {
        await axios.put(`/api/lesson/${editingLesson._id}`, lessonData);
        toast.success(t('adminLessons_updateSuccess'));
        setIsModalOpen(false);
        window.location.reload();
      } else {
        const response = await axios.post('/api/lesson', lessonData);
        if (response.data.success) {
          toast.success(t('adminLessons_createSuccess'));
          setIsModalOpen(false);
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('common_errorPrefix') + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    if (Array.isArray(lessons)) {
      lessons.forEach(lesson => {
        lesson.showFullDescription = false;
      });
    }
  }, [lessons]);

  useEffect(() => {
    if (editingLesson) {
      setFormData({
        nameLesson: editingLesson.nameLesson,
        videoUrl: editingLesson.videoUrl,
        description: editingLesson.description,
        timeVideo: editingLesson.timeVideo
      });
    } else {
      setFormData({
        nameLesson: '',
        videoUrl: '',
        description: '',
        timeVideo: '00:00'
      });
    }
  }, [editingLesson]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  if (loading) return <Loading loading={loading} />;
  if (error) return <Error error={error} />;
  if (!currentCourse) return <div className="p-4 text-lg font-semibold">{t('adminLessons_courseNotFound')}</div>;

  return (
    <>
      <Link
        to="/admin/courses"
        className="flex items-center px-2 py-1 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
      >
        <FiArrowLeft className="mr-2" />
        {t('adminLessons_backToCourses')}
      </Link>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {t('adminLessons_title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('adminLessons_course')}: {currentCourse.nameCourse}
              <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                {Array.isArray(lessons) ? lessons.length : 0} {t('adminLessons_lessonsSuffix')}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingLesson(null);
                setFormData({
                  nameLesson: '',
                  videoUrl: '',
                  description: '',
                  timeVideo: '00:00'
                });
                setIsModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <FiPlus className="mr-2" />
              {t('adminLessons_addLessonButton')}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('adminLessons_tableHeader_lessonNo')}
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('adminLessons_tableHeader_lessonName')}
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('adminLessons_tableHeader_videoUrl')}
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('adminLessons_tableHeader_description')}
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('adminLessons_tableHeader_duration')}
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('adminLessons_tableHeader_actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {/* Sử dụng currentLessons thay vì lessons */}
              {Array.isArray(currentLessons) && currentLessons.map((lesson, index) => (
                <tr key={lesson._id}>
                  <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {/* Index hiển thị trên trang, không phải index tuyệt đối */}
                    {(currentPage - 1) * lessonsPerPage + index + 1}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-500 dark:text-gray-300 whitespace-normal">
                    {lesson.nameLesson}
                  </td>
                  <td className="px-2 py-2 truncate">
                    <div className="text-sm text-gray-900 dark:text-white truncate">
                      <a
                        href={lesson.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 truncate block"
                      >
                        {lesson.videoUrl}
                      </a>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {lesson.description.length > 100 ? (
                        <div className="flex flex-col items-center">
                          <p className="text-left mb-1 text-xs">
                            {!lesson.showFullDescription
                              ? `${lesson.description.slice(0, 100)}...`
                              : lesson.description}
                          </p>
                          <button
                            onClick={() => {
                              lesson.showFullDescription = !lesson.showFullDescription;
                              setForceUpdate({});
                            }}
                            className=" text-xs bg-gray-100 dark:bg-gray-700 text-blue-600 hover:text-blue-800 font-medium hover:underline mt-1"
                          >
                            {!lesson.showFullDescription ? t('adminLessons_actions_viewMore') : t('adminLessons_actions_collapse')}
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs">{lesson.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                    {lesson.timeVideo || '00:00'}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingLesson(lesson);
                        setFormData({
                          nameLesson: lesson.nameLesson,
                          videoUrl: lesson.videoUrl,
                          description: lesson.description,
                          timeVideo: lesson.timeVideo
                        });
                        setIsModalOpen(true);
                      }}
                      title={t('adminLessons_actions_editLessonTitle')}
                      className="text-blue-600 bg-gray-100 dark:bg-gray-700 hover:text-blue-900 hover:dark:bg-gray-900 mr-2 p-1 rounded-sm"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson._id)}
                      title={t('adminLessons_actions_deleteLessonTitle')}
                      className="text-red-600 bg-gray-100 dark:bg-gray-700 hover:text-red-900 hover:dark:bg-gray-900 mr-2 p-1 rounded-sm"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/admin/lessons/${lesson._id}/exercises`}
                      state={{ index }}
                      className="text-green-600 hover:text-green-900 text-xs"
                    >
                      {t('adminLessons_actions_viewExercises')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        {lessons && lessons.length > 0 && ( // Chỉ hiển thị phân trang nếu có bài học
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}


        {/* Modal Form (không thay đổi) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 dark:text-white">
                {editingLesson ? t('adminLessons_modal_editTitle') : t('adminLessons_modal_addTitle')}
              </h2>
              {/* Form modal (không thay đổi) */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('adminLessons_form_lessonNameLabel')}
                    </label>
                    <input
                      type="text"
                      value={formData.nameLesson}
                      onChange={(e) =>
                        setFormData({ ...formData, nameLesson: e.target.value })
                      }
                      placeholder={t('adminLessons_form_lessonNamePlaceholder')}
                      className="mt-1 block w-full rounded-md p-4 bg-gray-100 dark:bg-gray-700 dark:text-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('adminLessons_form_videoUrlLabel')}
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, videoUrl: e.target.value })
                      }
                      placeholder={t('adminLessons_form_videoUrlPlaceholder')}
                      className="mt-1 block w-full rounded-md p-4 bg-gray-100 dark:bg-gray-700 dark:text-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {t('adminLessons_form_videoUrlDescription')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('adminLessons_form_descriptionLabel')}
                    </label>
                    <SimpleRichTextEditor
                      value={formData.description}
                      onChange={(des) =>
                        setFormData({ ...formData, description: des })
                      }
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border bg-gray-100 text-gray-700 hover:bg-gray-50 border-gray-300 dark:text-white dark:bg-gray-700 dark:border-gray-700 rounded-md text-sm font-medium "
                  >
                    {t('common_cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
                  >
                    {editingLesson ? t('common_update') : t('common_addNew')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminLessons;
// --- END OF FILE AdminLessons.jsx ---