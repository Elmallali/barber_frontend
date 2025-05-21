import React, { useState } from 'react';
import { Mail, Lock, User, Scissors } from 'lucide-react';

// Mock navigate function since we don't have router in this environment
const useNavigate = () => {
  return (path) => console.log(`Navigating to: ${path}`);
};

export  function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'client') {
      navigate('/client');
    } else {
      navigate('/barbier');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Area */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4">
            {role === 'client' ? 
              <User size={24} strokeWidth={2} /> : 
              <Scissors size={24} strokeWidth={2} />
            }
          </div>
          <h1 className="text-2xl font-bold text-gray-800">BarberTime</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="space-y-6">
            {/* Role Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                className={`py-2 px-4 rounded-md transition-all ${
                  role === 'client'
                    ? 'bg-white shadow-sm text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setRole('client')}
              >
                <div className="flex items-center justify-center">
                  <User size={16} className="mr-2" />
                  <span>Client</span>
                </div>
              </button>
              <button
                type="button"
                className={`py-2 px-4 rounded-md transition-all ${
                  role === 'barbier'
                    ? 'bg-white shadow-sm text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setRole('barbier')}
              >
                <div className="flex items-center justify-center">
                  <Scissors size={16} className="mr-2" />
                  <span>Barbier</span>
                </div>
              </button>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <div>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium"
            >
              Login
            </button>

            {/* Sign Up Option */}
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button type="button" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}