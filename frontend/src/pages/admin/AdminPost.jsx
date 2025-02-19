import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import useCRUDPost from '../../hooks/useCRUDPost';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContext';
import useGetUsers from '../../hooks/useGetUsers';
import { useTranslation } from 'react-i18next';
import SimpleRichTextEditor from '../../components/SimpleRichTextEditor';

const AdminPost = () => {
    const { t } = useTranslation();
    const { posts, loading, error, createPost, updatePost, deletePost } = useCRUDPost();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        permission: false
    });
    const { authUser } = useAuthContext();
    const { users } = useGetUsers();
    const isAdmin = authUser?.role === 'admin';
    const isCreator = authUser?.role === 'creator'; // Assuming 'creator' is the role for regular users who can post

    useEffect(() => {
        if (!isModalOpen) {
            setFormData({
                title: '',
                content: '',
                imageUrl: '',
                permission: false
            });
            setEditingPost(null);
        }
    }, [isModalOpen]);

    const handleDelete = async (postId) => {
        if (window.confirm(t('adminPost_deleteConfirmation'))) {
            try {
                await deletePost(postId);
                toast.success(t('adminPost_deleteSuccess'));
            } catch (error) {
                toast.error(t('adminPost_deleteErrorPrefix') + error.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error(t('adminPost_form_validationError'));
            return;
        }

        try {
            const postData = {
                ...formData,
                author: authUser?._id,
                updatedAt: new Date().toISOString()
            };

            if (editingPost) {
                await updatePost(editingPost._id, postData);
                toast.success(t('adminPost_updateSuccess'));
            } else {
                await createPost(postData);
                toast.success(t('adminPost_createSuccess'));
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error(t('common_errorPrefix') + error.message);
        }
    };

    const togglePermission = async (post) => {
        try {
            await updatePost(post._id, {
                ...post,
                permission: !post.permission
            });
            toast.success(t(post.permission ? 'adminPost_permissionUnapproved' : 'adminPost_permissionApproved'));
        } catch (error) {
            toast.error(t('adminPost_permissionUpdateErrorPrefix') + error.message);
        }
    };

    if (loading) return <Loading loading={loading} />;
    if (error) return <Error error={error} />;

    // Filter posts for creator role
    const filteredPosts = isCreator
        ? posts?.filter(post => post.author === authUser?._id)
        : posts;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {t('adminPost_title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('adminPost_totalPosts')}:
                        <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                            {filteredPosts?.length || 0} {t('adminPost_postsSuffix')}
                        </span>
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    <FiPlus className="mr-2" />
                    {t('adminPost_addPostButton')}
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('adminPost_tableHeader_stt')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('adminPost_tableHeader_title')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('adminPost_tableHeader_image')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('adminPost_tableHeader_status')}
                            </th>
                            {
                                authUser?.role === 'admin' && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        {t('adminPost_tableHeader_author')}
                                    </th>
                                )
                            }
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('adminPost_tableHeader_createdAt')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('adminPost_tableHeader_actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredPosts?.map((post, index) => (
                            <tr key={post._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {post.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {post.imageUrl && (
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.permission
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}>
                                        {post.permission ? t('adminPost_status_approved') : t('adminPost_status_pending')}
                                    </span>
                                </td>
                                {
                                    authUser?.role === 'admin' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {post.author ? users?.find((user) => user._id === post.author)?.username : 'N/A'}
                                        </td>
                                    )
                                }
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setEditingPost(post);
                                            setFormData({
                                                title: post.title,
                                                content: post.content,
                                                imageUrl: post.imageUrl,
                                                permission: post.permission
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        title={t('adminPost_actions_editPostTitle')}
                                        className="text-blue-600 bg-gray-100 dark:bg-gray-700 hover:text-blue-900 hover:dark:bg-gray-900 mr-4"
                                    >
                                        <FiEdit2 className="w-5 h-5" />
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => togglePermission(post)}
                                            className={`${post.permission
                                                ? 'text-red-600 hover:text-red-900'
                                                : 'text-green-600 hover:text-green-900'
                                                } bg-gray-100 dark:bg-gray-700 hover:dark:bg-gray-900 mr-4`}
                                        >
                                            {post.permission ? <FiX className="w-5 h-5" title={t('adminPost_actions_unapprovePostTitle')} /> : <FiCheck className="w-5 h-5" title={t('adminPost_actions_approvePostTitle')}/>}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        title={t('adminPost_actions_deletePostTitle')}
                                        className="text-red-600 bg-gray-100 dark:bg-gray-700 hover:text-red-900 hover:dark:bg-gray-900"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
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
                            {editingPost ? t('adminPost_modal_editTitle') : t('adminPost_modal_addTitle')}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('adminPost_form_titleLabel')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="mt-1 block w-full rounded-md p-3 bg-gray-100 dark:bg-gray-700 dark:text-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('adminPost_form_contentLabel')}
                                </label>
                                <SimpleRichTextEditor
                                    value={formData.content}
                                    onChange={(contentValue) => setFormData({ ...formData, content: contentValue })}
                                    // className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none p-3"
                                    // rows="4"
                                    // required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('adminPost_form_imageUrlLabel')}
                                </label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none p-3"
                                />
                            </div>
                            {isAdmin && (
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="permission"
                                        checked={formData.permission}
                                        onChange={(e) => setFormData({ ...formData, permission: e.target.checked })}
                                        className="h-4 w-4 bg-gray-100 dark:bg-gray-700 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="permission" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                        {t('adminPost_form_permissionLabel')}
                                    </label>
                                </div>
                            )}
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border bg-gray-100 text-gray-700 hover:bg-gray-50 border-gray-300 dark:text-white dark:bg-gray-700 dark:border-gray-700 rounded-md text-sm font-medium"
                                >
                                    {t('common_cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
                                >
                                    {editingPost ? t('common_update') : t('common_addNew')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPost;