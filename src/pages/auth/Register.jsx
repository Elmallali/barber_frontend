import React, { useState } from 'react';
import { Mail, Lock, User, Scissors, UserPlus } from 'lucide-react';

export  function Register() {
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    console.log({ role, name, email, password });
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
                  role === 'client'
                    ? 'bg-white shadow-sm text-green-600 font-medium'
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
                    ? 'bg-white shadow-sm text-green-600 font-medium'
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
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
              </div>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all font-medium"
            >
              Create Account
            </button>

            {/* Sign In Option */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button type="button" className="text-green-600 hover:text-green-800 font-medium">
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}