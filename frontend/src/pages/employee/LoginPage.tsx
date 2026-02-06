// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import bakeryLogo from '../../assets/bakeryHUB.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login/', {
        username: username,
        password: password
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      switch(user.role) {
        case 'ADMIN':
        case 'OWNER':
        case 'MANAGER':
          navigate('/admin');
          break;
        case 'FACTORY_MANAGER':
          navigate('/factory-manager');
          break;
        case 'SALESPERSON':
          navigate('/pos');
          break;
        case 'CUSTOMER':
          navigate('/shop');
          break;
        default:
          navigate('/');
      }

    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.response && err.response.status === 401) {
        setError('Invalid Username or Password. Please try again.');
      } else {
        setError('Server error. Is the Backend running?');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={bakeryLogo}
            alt="BakeryHUB Logo"
            className="h-20 object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-center text-gray-800">
          Employee Login
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1 mb-6">
          Access BakeryHUB management system
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition shadow-md"
          >
            Log In
          </button>

        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} BakeryHUB. Internal Employee Portal
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
