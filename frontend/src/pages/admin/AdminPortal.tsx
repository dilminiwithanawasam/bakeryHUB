import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPortal: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Admin Portal</h1>
        <p className="text-sm text-gray-600 mb-6">Access administrative tools and user management.</p>

        <div className="space-y-3">
          <button onClick={() => navigate('/admin/dashboard')} className="w-full px-4 py-3 bg-blue-600 text-white rounded-md">Open Admin Dashboard</button>
          <button onClick={() => navigate('/signup-employee')} className="w-full px-4 py-3 bg-green-600 text-white rounded-md">Register Employee</button>
          <button onClick={() => navigate('/employee/EmployeeListView')} className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-md">View Employees</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
