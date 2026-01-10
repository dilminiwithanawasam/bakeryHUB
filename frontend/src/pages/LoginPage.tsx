import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/bakeryHUB.png'; 

const LoginPage = () => {
  const navigate = useNavigate();
  
  // Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  // Note: "Last Logged In" state and useEffect removed as requested.

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      
      const token = response.data.token;
      const role = response.data.user.role;
      const cleanRole = role.toUpperCase().trim();

      // 1. Save Token
      localStorage.setItem('token', token);
      localStorage.setItem('role', cleanRole);

      // 2. Navigate
      if (cleanRole === 'ADMIN') navigate('/admin');
      else if (cleanRole === 'SALESPERSON') navigate('/pos');
      else if (cleanRole === 'FACTORY_DISTRIBUTOR') navigate('/factory');
      else navigate('/pos'); 

    } catch (err: any) {
      console.error("Login Failed:", err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* --- HEADER --- */}
      {/* Changed 'justify-between' to 'justify-center' to center the logo */}
      <header className="flex justify-center items-center py-2">
        
        {/* Logo Container */}
        <div className="p-2 w-50 h-50 flex items-center justify-center">
           <img src={logo} alt="BakeryHUB" className="w-full h-auto object-contain" />
        </div>

      </header>


      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex items-start justify-center pt-10">
        
        {/* Login Card */}
        <div className="bg-[#F4F6D6] w-full max-w-lg p-2 rounded-xl shadow-sm">
          
          <h2 className="text-center text-gray-700 text-xs tracking-widest uppercase mb-4">LOGIN</h2>
          
          {/* Horizontal Line */}
          <hr className="border-gray-400 mb-8" />

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-center text-red-600 text-xs bg-red-100 p-2 rounded border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Username *</label>
              <input
                type="text"
                className="w-full p-3 rounded-md border-none focus:ring-2 focus:ring-[#C88758] outline-none shadow-sm bg-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Password *</label>
              <input
                type="password"
                className="w-full p-3 rounded-md border-none focus:ring-2 focus:ring-[#C88758] outline-none shadow-sm bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 mt-4">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  id="remember"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-gray-200 checked:bg-[#C88758] checked:border-transparent transition-all"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                {/* Custom Checkmark Icon */}
                <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none hidden peer-checked:block left-1 top-1" viewBox="0 0 14 14" fill="none">
                   <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <label htmlFor="remember" className="text-xs text-gray-700 cursor-pointer">Remember Me</label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#C88758] hover:bg-[#b07449] text-white text-xs font-bold py-4 rounded-md shadow-md transition uppercase tracking-wide mt-8"
            >
              Login
            </button>

            {/* Forgot Password Link */}
            <div className="text-center mt-6">
              <a href="#" className="text-xs text-black hover:underline">
                Forgot your password ?
              </a>
            </div>

          </form>
        </div>

      </main>

    </div>
  );
};

export default LoginPage;