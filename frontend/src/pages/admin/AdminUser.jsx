// AdminUser.js
import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContext';
import useGetUsers from '../../hooks/useGetUsers'; // Đảm bảo đường dẫn đúng
import useCUDUser from '../../hooks/useCUDUser'; // Đảm bảo đường dẫn đúng
import { useTranslation } from 'react-i18next';

const AdminUser = () => {
  const { t } = useTranslation();
  const { users, loading, error, refetchUsers } = useGetUsers(); // Nhận refetchUsers từ hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    avatarUrl: '',
    role: 'user',
    gender: ''
  });
  const { createUser, updateUser, deleteUser } = useCUDUser();
  const { authUser } = useAuthContext();
  const isAdmin = authUser?.role === 'admin';

  useEffect(() => {
    if (!isModalOpen) {
      // Reset form khi modal đóng
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'user',
        gender: ''
      });
      setEditingUser(null);
    }
  }, [isModalOpen]);



  const handleDelete = async (userId) => {
    try {
      // Kiểm tra xem có phải đang cố xóa chính mình không
      if (userId === authUser._id) {
        toast.error(t('cannotDeleteOwnAccount'));
        return;
      }

      if (window.confirm(t('confirmDeleteUser'))) {
        await deleteUser(userId);
        toast.success(t('deleteUserSuccess'));
        refetchUsers();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || t('cannotDeleteUser');
      toast.error(errorMessage);
      console.error('Delete error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.email.trim() || !formData.gender) { // Password không còn required ở đây
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email không hợp lệ');
      return;
    }

    // Validate gender
    if (!['male', 'female'].includes(formData.gender)) {
      toast.error('Giới tính phải là nam hoặc nữ');
      return;
    }

    try {
      let userData = { // Sử dụng let để có thể chỉnh sửa userData
        ...formData,
        role: formData.role || 'user'
      };

      if (!editingUser) { // Nếu là thêm mới
        if (!formData.password) { // Bắt buộc password khi thêm mới
          toast.error('Mật khẩu là bắt buộc khi thêm người dùng mới.');
          return;
        }
        // Mật khẩu đã có trong userData khi thêm mới
      } else { // Nếu là chỉnh sửa
        delete userData.password; // Loại bỏ password khỏi userData khi chỉnh sửa
      }


      if (editingUser) {
        await updateUser(editingUser._id, userData);
        toast.success('Cập nhật người dùng thành công');
      } else {
        await createUser(userData); // Gọi createUser để tạo người dùng trực tiếp (không xác thực email)
        toast.success('Thêm người dùng thành công');
      }
      setIsModalOpen(false);
      refetchUsers(); // Gọi refetchUsers để cập nhật danh sách
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra';
      toast.error(errorMessage);
    }
  };

  if (loading) return <Loading loading={loading} />;
  if (error) return <Error error={error} />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('adminUser')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('totalUsers')}
            <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              {users?.length || 0} {t('user')}
            </span>
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <FiPlus className="mr-2" />
          {t('addUser')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('stt')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('email')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Avatar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('role')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('action')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users?.map((user, index) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full ${user.role === 'admin'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : user.role === 'creator'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setFormData({
                        username: user.username,
                        email: user.email,
                        password: '',
                        role: user.role,
                        gender: user.gender
                      });
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 bg-gray-100 dark:bg-gray-700 hover:text-blue-900 hover:dark:bg-gray-900 mr-4"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  {isAdmin && user._id !== authUser._id && ( 
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 bg-gray-100 dark:bg-gray-700 hover:text-red-900 hover:dark:bg-gray-900"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {editingUser ? t('editUser') : t('addNewUser')}
              
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('nameUser')}
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-1 block w-full rounded-md p-3 bg-gray-100 dark:bg-gray-700 dark:text-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none p-3"
                  required
                />
              </div>
              {!editingUser && ( // Chỉ hiển thị trường mật khẩu khi không ở chế độ chỉnh sửa (thêm mới)
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('password')}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none p-3"
                    required={!editingUser} // Vẫn required khi thêm mới
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('gender')}
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none p-3"
                  required
                >
                  <option value="">{t('selectGender')}</option>
                  <option value="male">{t('male')}</option>
                  <option value="female">{t('female')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('role')}
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none p-3"
                >
                  <option value="user">User</option>
                  <option value="creator">Creator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border bg-gray-100 text-gray-700 hover:bg-gray-50 border-gray-300 dark:text-white dark:bg-gray-700 dark:border-gray-700 rounded-md text-sm font-medium"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
                >
                  {editingUser ? t('update') : t('addNew')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUser;