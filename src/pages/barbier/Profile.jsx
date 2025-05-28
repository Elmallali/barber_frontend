import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  ClockIcon,
  AlertCircleIcon
} from 'lucide-react';
import api from '../../service/api';
import authService from '../../service/authService';

export function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [barberData, setBarberData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await authService.getCurrentUser();
        
        setName(userData.name || '');
        setEmail(userData.email || '');
        setPhone(userData.phone || '');
        
        // If user is a barber, fetch barber-specific data
        if (userData.role === 'BARBER' && userData.barberId) {
          try {
            const barberResponse = await api.get(`/api/barber/profile/${userData.barberId}`);
            const barberData = barberResponse.data;
            setBarberData(barberData);
            
            // Set barber-specific fields
            if (barberData.experience) {
              setBio(`Professional barber with ${barberData.experience} of experience specializing in modern cuts and classic styles.`);
            }
            
            // Set working hours if available
            if (barberData.working_hours) {
              setHours(barberData.working_hours);
            } else {
              setHours('9:00 AM - 6:00 PM'); // Default
            }
          } catch (barberError) {
            console.error('Error fetching barber data:', barberError);
            // Set defaults if barber data fetch fails
            setBio('Professional barber specializing in modern cuts and classic styles.');
            setHours('9:00 AM - 6:00 PM');
          }
        } else {
          // Set defaults for non-barber users or if barber ID is missing
          setBio('Professional barber specializing in modern cuts and classic styles.');
          setHours('9:00 AM - 6:00 PM');
        }
        
        // Set avatar if available, otherwise use default
        if (userData.avatar_url) {
          // Use the full URL provided by the backend
          setAvatar(userData.avatar_url);
        } else if (userData.avatar) {
          // Fallback to constructing URL if only path is provided
          // Check if the avatar is a full URL or just a path
          if (userData.avatar.startsWith('http')) {
            setAvatar(userData.avatar);
          } else {
            // Construct the full URL for the avatar
            setAvatar(`http://localhost:8000/storage/${userData.avatar}`);
          }
        } else {
          // Use default avatar if none is provided
          setAvatar('https://randomuser.me/api/portraits/men/85.jpg');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      // Update user profile
      const response = await api.put('/api/user/profile', {
        name,
        email,
        phone
      });
      
      // If user is a barber and we have barber data, update barber-specific info
      if (barberData && barberData.id) {
        try {
          await api.put(`/api/barber/profile/${barberData.id}`, {
            working_hours: hours,
            bio: bio
          });
        } catch (barberError) {
          console.error('Error updating barber data:', barberError);
          setSaveError('Basic profile updated, but barber details could not be saved.');
          return;
        }
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveError('Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    try {
      await api.put('/api/user/password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });
      
      alert('Password updated successfully!');
      setShowModal(false);
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        alert('Current password is incorrect or the new password does not meet requirements.');
      } else {
        alert('Failed to update password. Please try again.');
      }
      console.error('Error updating password:', error);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show local preview immediately
      const newURL = URL.createObjectURL(file);
      setAvatar(newURL);
      
      // Upload to server
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        
        const response = await api.post('/api/user/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Update avatar with the URL returned from the server
        if (response.data && response.data.avatar_url) {
          setAvatar(response.data.avatar_url);
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('Failed to upload avatar. The preview is only temporary.');
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h1>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar + Upload */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
              <img
                src={avatar}
                alt="Barber Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4">
              <label className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 w-full">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                    Working Hours
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="hours"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                ></textarea>
              </div>

              <div className="flex flex-col w-full">
                {saveSuccess && (
                  <div className="mb-4 p-2 bg-green-100 text-green-800 rounded-lg flex items-center">
                    <span className="mr-2">✓</span> Profile updated successfully!
                  </div>
                )}
                
                {saveError && (
                  <div className="mb-4 p-2 bg-red-100 text-red-800 rounded-lg flex items-center">
                    <AlertCircleIcon size={16} className="mr-2" /> {saveError}
                  </div>
                )}
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Change Password
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
