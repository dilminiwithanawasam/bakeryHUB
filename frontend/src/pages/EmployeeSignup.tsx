import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const EmployeeSignup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    nic: '',
    contact_no: '',
    hire_date: '',
    role: 'SALESPERSON' // Default role
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await api.post('/auth/register-employee', formData);
      alert('Employee Created Successfully!');
      navigate('/dashboard'); // Go back to dashboard after creating
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Register New Employee</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <input name="first_name" placeholder="First Name" onChange={handleChange} required className="p-2 border rounded w-full" />
            <input name="last_name" placeholder="Last Name" onChange={handleChange} required className="p-2 border rounded w-full" />
          </div>

          <input name="nic" placeholder="NIC Number" onChange={handleChange} required className="p-2 border rounded w-full" />
          <input name="contact_no" placeholder="Contact Number" onChange={handleChange} required className="p-2 border rounded w-full" />
          
          <div>
            <label className="text-xs text-gray-500 block mb-1">Hire Date</label>
            <input type="date" name="hire_date" onChange={handleChange} required className="p-2 border rounded w-full" />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Assign Role</label>
            <select name="role" onChange={handleChange} className="p-2 border rounded w-full bg-white">
              <option value="SALESPERSON">Salesperson</option>
              <option value="MANAGER">Outlet Manager</option>
              <option value="FACTORY_DISTRIBUTOR">Factory Distributor</option>
              <option value="ADMIN">Admin / Owner</option>
            </select>
          </div>

          <hr className="my-4 border-gray-300" />
          <p className="text-sm font-bold text-gray-500 mb-2">Login Credentials</p>

          <input name="username" placeholder="Username" onChange={handleChange} required className="p-2 border rounded w-full" />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="p-2 border rounded w-full" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="p-2 border rounded w-full" />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium">
            Create Account
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition text-sm"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeSignup;