import React, { useState } from 'react';
import { FaSave, FaUser, FaEnvelope, FaLock, FaVenusMars } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import useCUDUser from '../../hooks/useCUDUser';

const ProfileSettings = ({ authUser, onUpdateSuccess }) => {
    const { t } = useTranslation();
    // const { updateUser } = useCUDUser();
    const [formData, setFormData] = useState({
        username: authUser.username || '',
        email: authUser.email || '',
        gender: authUser.gender || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const { updateUserInfo } = useCUDUser();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Validate password
            if (formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    toast.error(t('passwords_do_not_match'));
                    return;
                }
                if (formData.newPassword.length < 6) {
                    toast.error(t('password_too_short'));
                    return;
                }
                if (!formData.currentPassword) {
                    toast.error(t('current_password_required'));
                    return;
                }
            }
    
            // Validate username
            if (formData.username !== authUser.username) {
                if (formData.username.length < 3) {
                    toast.error(t('username_too_short'));
                    return;
                }
                if (formData.username.includes(' ')) {
                    toast.error(t('username_no_spaces'));
                    return;
                }
            }
    
            // Prepare update data
            const updatedData = {};
            
            // Only include changed fields
            if (formData.username !== authUser.username) {
                updatedData.username = formData.username.trim();
            }
            
            if (formData.gender !== authUser.gender) {
                updatedData.gender = formData.gender;
            }
            
            if (formData.newPassword) {
                updatedData.currentPassword = formData.currentPassword;
                updatedData.newPassword = formData.newPassword;
            }
    
            // Check if there are any changes
            if (Object.keys(updatedData).length === 0) {
                toast.error(t('no_changes_made'));
                return;
            }
    
            // Log update attempt
            console.log("Attempting to update user data:", {
                ...updatedData,
                newPassword: updatedData.newPassword ? '[HIDDEN]' : undefined
            });
    
            const result = await updateUserInfo(updatedData);
            
            if (result) {
                toast.success(t('profile_updated_successfully'));
                onUpdateSuccess(result);
                
                // Reset password fields
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            }
        } catch (error) {
            console.error("Update failed:", error);
            toast.error(error.message || t('update_failed'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username Field */}
                <div className="form-group">
                    <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-2">
                        <FaUser className="text-blue-500" />
                        <span>{t('username')}</span>
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 dark:border-gray-600 
                                 dark:bg-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Email Field - Thêm disabled */}
                <div className="form-group">
                    <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-2">
                        <FaEnvelope className="text-blue-500" />
                        <span>{t('email')}</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                              bg-gray-100 dark:text-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    />
                </div>

                {/* Gender Field */}
                <div className="form-group">
                    <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-2">
                        <FaVenusMars className="text-blue-500" />
                        <span>{t('gender')}</span>
                    </label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 dark:border-gray-600 
                                 dark:bg-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">{t('select_gender')}</option>
                        <option value="male">{t('male')}</option>
                        <option value="female">{t('female')}</option>
                    </select>
                </div>
            </div>

            {/* Password Change Section */}
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    {t('change_password')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                        <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-2">
                            <FaLock className="text-blue-500" />
                            <span>{t('current_password')}</span>
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:text-gray-100 border border-gray-300 dark:border-gray-600 
                                     dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="form-group">
                        <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-2">
                            <FaLock className="text-blue-500" />
                            <span>{t('new_password')}</span>
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:text-gray-100 border border-gray-300 dark:border-gray-600 
                                     dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="form-group md:col-span-2">
                        <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-2">
                            <FaLock className="text-blue-500" />
                            <span>{t('confirm_password')}</span>
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:text-gray-100 border border-gray-300 dark:border-gray-600 
                                     dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
                <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg
                             hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:ring-opacity-50 transition-colors duration-200"
                >
                    <FaSave />
                    <span>{t('save_changes')}</span>
                </button>
            </div>
        </form>
    );
};

export default ProfileSettings;