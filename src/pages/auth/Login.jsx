// src/pages/auth/Login.jsx
import React, { useState, useEffect } from "react";
import { Mail, Lock, UserPlus, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { login as loginThunk } from "../../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, errorMessage } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  
  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Check if we have a token and user data
    if (token && user) {
      // Redirect based on user role
      if (user.role === 'BARBER') {
        navigate('/barbier', { replace: true });
      } else {
        navigate('/client', { replace: true });
      }
    }
  }, [user, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!email.trim()) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await dispatch(loginThunk({ email, password })).unwrap();
      // Redirect based on user role
      if (result.user.role === "BARBER") {
        navigate("/barbier");
      } else {
        navigate("/client");
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4">
            <UserPlus size={24} strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">BarberTime</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form
          className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
          onSubmit={handleLogin}
        >
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
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
                  className={`w-full pl-10 pr-4 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {isError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle size={16} className="text-red-500 mr-2 mt-0.5" />
                <p className="text-sm text-red-600">
                  {typeof errorMessage === 'object' 
                    ? 'Authentication failed. Please check your credentials.' 
                    : errorMessage || 'Invalid email or password'}
                </p>
              </div>
            )}
            
            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
