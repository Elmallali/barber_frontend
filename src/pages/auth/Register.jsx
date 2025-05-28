import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Scissors, UserPlus, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerThunk } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, errorMessage, user } = useSelector((state) => state.auth);
  
  const [role, setRole] = useState('CLIENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'BARBER') {
        navigate('/barbier');
      } else {
        navigate('/client');
      }
    }
  }, [user, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!email.trim()) errors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
    if (!phone.trim()) errors.phone = 'Phone number is required';
    if (!password) errors.password = 'Password is required';
    if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) errors.terms = 'You must agree to the terms and conditions';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const userData = {
        name,
        email,
        phone,
        password,
        password_confirmation: confirmPassword,
        role
      };
      
      const result = await dispatch(registerThunk(userData)).unwrap();
      if (result) {
        if (role === 'BARBER') {
          navigate('/barbier');
        } else {
          navigate('/client');
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Area */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white mb-4">
            <UserPlus size={24} strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">BarberTime</h1>
          <p className="text-gray-500 mt-1">Create your account</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="space-y-6">
            {/* Role Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                className={`py-2 px-4 rounded-md transition-all ${
                  role === 'CLIENT'
                    ? 'bg-white shadow-sm text-green-600 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setRole('CLIENT')}
              >
                <div className="flex items-center justify-center">
                  <User size={16} className="mr-2" />
                  <span>Client</span>
                </div>
              </button>
              <button
                type="button"
                className={`py-2 px-4 rounded-md transition-all ${
                  role === 'BARBER'
                    ? 'bg-white shadow-sm text-green-600 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setRole('BARBER')}
              >
                <div className="flex items-center justify-center">
                  <Scissors size={16} className="mr-2" />
                  <span>Barber</span>
                </div>
              </button>
            </div>

            {/* Full Name Field */}
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className={`w-full pl-10 pr-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  className={`w-full pl-10 pr-4 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-600">
                  I agree to the{" "}
                  <button type="button" className="text-green-600 hover:text-green-800 font-medium">
                    Terms and Conditions
                  </button>
                </label>
                {formErrors.terms && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.terms}</p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {isError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle size={16} className="text-red-500 mr-2 mt-0.5" />
                <p className="text-sm text-red-600">
                  {typeof errorMessage === 'object' 
                    ? 'Registration failed. Please check your information.' 
                    : errorMessage || 'Registration failed. Please try again.'}
                </p>
              </div>
            )}
            
            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className={`w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Sign In Option */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                type="button" 
                className="text-green-600 hover:text-green-800 font-medium"
                onClick={() => navigate('/login')}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}