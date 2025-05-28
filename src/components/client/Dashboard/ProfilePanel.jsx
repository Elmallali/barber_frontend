import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  LockIcon,
  LoaderIcon,
  XIcon,
  CheckIcon,
  AlertCircleIcon
} from 'lucide-react';
import { fetchClientProfile, updateUserProfile, changePassword } from '../../../service/clientService';

export const ProfilePanel = ({ user: initialUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [formData, setFormData] = useState({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    phone: initialUser?.phone || '',
    birthDate: initialUser?.birthDate || '',
    gender: initialUser?.gender || ''
  });
  
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchClientProfile();
        
        // Handle potential null or undefined data
        if (!data) {
          throw new Error('Failed to load profile data');
        }
        
        setProfileData(data);
        
        // Update form data with fetched user data
        if (data.user) {
          // Format birth date for display if it exists
          let formattedBirthDate = '';
          if (data.user.birth_date) {
            try {
              // Try to parse and format the date
              const dateObj = new Date(data.user.birth_date);
              if (!isNaN(dateObj.getTime())) {
                formattedBirthDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
              } else {
                formattedBirthDate = data.user.birth_date;
              }
            } catch (e) {
              console.error('Error formatting birth date from API:', e);
              formattedBirthDate = data.user.birth_date;
            }
          }
          
          console.log('Setting birth date in form:', formattedBirthDate);
          
          setFormData({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            birthDate: formattedBirthDate,
            gender: data.user.gender || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProfileData();
  }, [initialUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  // This duplicate function has been removed

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      // Format data for the API
      // Ensure birth_date is in the correct format (YYYY-MM-DD)
      let formattedBirthDate = formData.birthDate;
      if (formData.birthDate) {
        // Try to format the date if it's not already in the correct format
        try {
          const dateObj = new Date(formData.birthDate);
          if (!isNaN(dateObj.getTime())) {
            formattedBirthDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
          }
        } catch (e) {
          console.error('Error formatting birth date:', e);
        }
      }
      
      const profileUpdateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birth_date: formattedBirthDate,
        gender: formData.gender
      };
      
      console.log('Sending profile update data:', profileUpdateData);
      
      // Call the API to update the profile
      await updateUserProfile(profileUpdateData);
      
      // Update the profile data with the new form data
      setProfileData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          birth_date: formData.birthDate, // Ensure we use the correct field name
          gender: formData.gender
        }
      }));
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    
    // Validate passwords
    if (!passwordData.new_password || passwordData.new_password.trim() === '') {
      setPasswordError('New password is required');
      return;
    }
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.new_password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setPasswordLoading(true);
      
      // Format the data according to Laravel's expected structure
      const passwordUpdateData = {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        password_confirmation: passwordData.confirm_password
      };
      
      console.log('Sending password update data:', passwordUpdateData);
      await changePassword(passwordUpdateData);
      setPasswordSuccess(true);
      
      // Reset form
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };
  
  // Handle password input changes
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Get user data from profile or fallback to initial user prop
  const user = profileData?.user || initialUser || {};
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-medium">My Profile</h2>
        <p className="text-gray-600 text-sm mt-1">
          Manage your personal information
        </p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-center">
            <CheckIcon size={16} className="mr-2" />
            {successMessage}
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <LoaderIcon className="animate-spin mr-2" />
            <span>Loading profile data...</span>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Avatar & Info */}
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="flex flex-col items-center">
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-semibold">
                      {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-sm hover:bg-blue-700 transition-colors duration-200">
                    <UserIcon size={16} />
                  </button>
                </div>
                <h3 className="mt-4 font-medium text-lg">{user.name}</h3>
                <p className="text-gray-500 text-sm">Member since {user.member_since || 'N/A'}</p>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <LockIcon size={16} className="mr-2" />
                  Change Password
                </button>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-2/3 md:pl-8">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <UserIcon size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MailIcon size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <PhoneIcon size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Birth Date & Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Birth Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <CalendarIcon size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        disabled={saveLoading}
                        className="mr-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saveLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                      >
                        {saveLoading ? (
                          <>
                            <LoaderIcon size={16} className="animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError(null);
                  setPasswordSuccess(false);
                  setPasswordData({
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon size={20} />
              </button>
            </div>
            
            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start">
                <AlertCircleIcon size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}
            
            {passwordSuccess ? (
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckIcon size={24} className="text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Password Changed!</h3>
                <p className="text-gray-600">Your password has been updated successfully.</p>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordInputChange}
                      required
                      minLength={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordInputChange}
                      required
                      minLength={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="mr-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                  >
                    {passwordLoading ? (
                      <>
                        <LoaderIcon size={16} className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
