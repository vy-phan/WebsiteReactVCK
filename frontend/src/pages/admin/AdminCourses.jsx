import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import useGetCourse from '../../hooks/useGetCourse';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuthContext } from '../../context/AuthContext';
import useGetUsers from '../../hooks/useGetUsers';
import SimpleRichTextEditor from '../../components/SimpleRichTextEditor';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import { useTranslation } from 'react-i18next';

const AdminCourses = () => {
  const { t } = useTranslation();
  const { courses, loading, error } = useGetCourse();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const { authUser } = useAuthContext();
  const { users } = useGetUsers();

  const [formData, setFormData] = useState({
    nameCourse: '',
    description: '',
    imageCourse: '',
  });

  const courseByCreator = courses.filter(course => course.author === authUser?._id)


  const handleDelete = async (courseId) => {
    if (window.confirm(t('adminCourse_deleteConfirmation'))) {
      try {
        await axios.delete(`/api/course/${courseId}`);
        toast.success(t('adminCourse_deleteSuccess'));
        // Refresh danh sách khóa học
        window.location.reload();
      } catch (error) {
        toast.error(t('adminCourse_deleteError'));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...formData,
        author: authUser._id // Thêm author ID từ user đang đăng nhập
      };

      if (editingCourse) {
        await axios.put(`/api/course/${editingCourse._id}`, courseData);
        toast.success(t('adminCourse_updateSuccess'));
      } else {
        await axios.post('/api/course', courseData);
        toast.success(t('adminCourse_createSuccess'));
      }
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(t('common_errorPrefix'));
    }
  };

  if (loading) return <Loading loading={loading} />;
  if (error) return <Error error={error} />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            {t('adminCourse_title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('adminCourse_totalCourses')}:
            <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              {courses.length}
            </span>
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCourse(null);
            setFormData({
              nameCourse: '',
              description: '',
              imageCourse: ''
            });
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <FiPlus className="mr-2" />
          {t('adminCourse_addCourseButton')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('adminCourse_tableHeader_courseName')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('adminCourse_tableHeader_description')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('adminCourse_tableHeader_author')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('adminCourse_tableHeader_actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {
              authUser?.role === 'admin' ? (
                // hiển thị tất cả khóa học nếu là admin
                courses.map((course) => (
                  <tr key={course._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={course.imageCourse}
                          alt={course.nameCourse}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {course.nameCourse}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                        {course.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {course.author ? users?.find((user) => user._id === course.author)?.username : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingCourse(course);
                          setFormData({
                            nameCourse: course.nameCourse,
                            description: course.description,
                            imageCourse: course.imageCourse
                          });
                          setIsModalOpen(true);
                        }}
                        title={t('adminCourse_actions_editCourseTitle')}
                        className="text-blue-600 bg-gray-100 dark:bg-gray-700 hover:text-blue-900 hover:dark:bg-gray-900 mr-4"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        title={t('adminCourse_actions_deleteCourseTitle')}
                        className="text-red-600 bg-gray-100 dark:bg-gray-700 hover:text-red-900 hover:dark:bg-gray-900 mr-4"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                      <a
                        href={`/admin/courses/${course._id}/lessons`}
                        className="text-green-600  hover:text-green-900"
                      >
                        {t('adminCourse_actions_viewLessons')}
                      </a>
                    </td>
                  </tr>
                ))
              )
                : (
                  // hiển khóa học của đúng tác giả đó
                  courseByCreator.map((course) => (
                    <tr key={course._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={course.imageCourse}
                            alt={course.nameCourse}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {course.nameCourse}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                          {course.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {course.author ? users.find((user) => user._id === course.author)?.username : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingCourse(course);
                            setFormData({
                              nameCourse: course.nameCourse,
                              description: course.description,
                              imageCourse: course.imageCourse
                            });
                            setIsModalOpen(true);
                          }}
                          title={t('adminCourse_actions_editCourseTitle')}
                          className="text-blue-600 bg-gray-100 dark:bg-gray-700 hover:text-blue-900 hover:dark:bg-gray-900 mr-4"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          title={t('adminCourse_actions_deleteCourseTitle')}
                          className="text-red-600 bg-gray-100 dark:bg-gray-700 hover:text-red-900 hover:dark:bg-gray-900 mr-4"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                        <a
                          href={`/admin/courses/${course._id}/lessons`}
                          className="text-green-600  hover:text-green-900"
                        >
                          {t('adminCourse_actions_viewLessons')}
                        </a>
                      </td>
                    </tr>
                  ))
                )
            }
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {editingCourse ? t('adminCourse_modal_editTitle') : t('adminCourse_modal_addTitle')}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    {t('adminCourse_form_courseNameLabel')}
                  </label>
                  <input
                    type="text"
                    value={formData.nameCourse}
                    onChange={(e) =>
                      setFormData({ ...formData, nameCourse: e.target.value })
                    }
                    placeholder={t('adminCourse_form_courseNamePlaceholder')}
                    className="mt-1 block w-full p-4 bg-gray-100 dark:bg-gray-700 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    {t('adminCourse_form_descriptionLabel')}
                  </label>
                  <SimpleRichTextEditor
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    {t('adminCourse_form_imageUrlLabel')}
                  </label>
                  <input
                    type="url"
                    value={formData.imageCourse}
                    onChange={(e) =>
                      setFormData({ ...formData, imageCourse: e.target.value })
                    }
                    placeholder={t('adminCourse_form_imageUrlPlaceholder')}
                    className="mt-1 block w-full p-4 bg-gray-100 dark:bg-gray-700 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:text-white"
                    required
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
                  {editingCourse ? t('common_update') : t('common_addNew')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;