import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

const EmployeeListView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [employees, setEmployees] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const resp = await api.get('/admin/employees/').catch(() => ({ data: null }));
        if (!resp?.data) {
          setError('Could not fetch employees');
          setEmployees([]);
        } else {
          setEmployees(resp.data.employees || []);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees: Array<any> =
    selectedRole === 'ALL' ? employees : employees.filter((emp: any) => emp.role === selectedRole);

  return (
    <div className="min-h-screen flex bg-gray-50">

      <AdminSidebar />

      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Employee Management</h1>
            <p className="text-sm text-gray-500 mt-1">View, filter, and manage bakery staff members</p>
          </div>

          {/* Back to Dashboard */}
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-3">
          {['ALL', 'ADMIN', 'MANAGER', 'SALESPERSON', 'FACTORY_MANAGER'].map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                selectedRole === role ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-gray-500">User ID</th>
                <th className="px-6 py-4 text-left font-bold text-gray-500">Username</th>
                <th className="px-6 py-4 text-left font-bold text-gray-500">Name</th>
                <th className="px-6 py-4 text-left font-bold text-gray-500">Role</th>
                <th className="px-6 py-4 text-left font-bold text-gray-500">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">Loading...</td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">No employees found</td>
                </tr>
              ) : (
                filteredEmployees.map(employee => (
                  <tr
                    key={employee.id}
                    onClick={() => navigate(`/admin/employees/${employee.id}`)}
                    className="border-b last:border-none hover:bg-blue-50 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-700">{employee.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{employee.username}</td>
                    <td className="px-6 py-4 text-gray-600">{employee.first_name} {employee.last_name}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">{employee.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${employee.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {employee.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {error && <div className="mt-6 text-red-600">{error}</div>}

      </main>
    </div>
  );
};

export default EmployeeListView;
