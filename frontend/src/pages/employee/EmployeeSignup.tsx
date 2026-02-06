import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  User, 
  Mail, 
  Key, 
  Phone, 
  Calendar, 
  BadgeCheck,
  Shield,
  X,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import api from '../../api/axios'; // Ensure this path is correct

const EmployeeSignup = () => {
  const navigate = useNavigate();
  // Ensure only admin users can access this page
  React.useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        return;
      }
      const user = JSON.parse(userStr);
      const isAdmin =
        user?.role === 'ADMIN' || user?.is_staff || user?.is_admin || user?.is_superuser;
      if (!isAdmin) {
        // Non-admins are redirected to home (or their dashboard)
        navigate('/');
      }
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    nic: '',
    contact_no: '',
    hire_date: '',
    role: 'SALESPERSON'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Missing auth token - please login as an Admin first.');
        setIsSubmitting(false);
        return;
      }
      await api.post('/auth/register/employee/', formData);
      
      setSuccess('Employee Created Successfully!');
      
      // Auto redirect after success
      setTimeout(() => {
        navigate('/admin');
      }, 2000);

    } catch (err: any) {
      console.error(err);
      // Show full response body when available to aid debugging
      const respData = err.response?.data;
      const errorMessage = respData ? JSON.stringify(respData) : (err.message || 'Registration failed. Check your input.');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Register New Employee</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Add new team members to your bakery staff. Fill in all required details to create their account.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Employee Details</h2>
              </div>
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Status Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-fadeIn">
                <div className="p-2 bg-red-100 rounded-lg">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-red-800">Registration Failed</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3 animate-fadeIn">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-green-800">Employee Created Successfully!</p>
                  <p className="text-green-600 text-sm mt-1">Redirecting to dashboard...</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name="first_name"
                        placeholder="John"
                        onChange={handleChange}
                        required
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name="last_name"
                        placeholder="Doe"
                        onChange={handleChange}
                        required
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      NIC Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name="nic"
                        placeholder="123456789V"
                        onChange={handleChange}
                        required
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                      <BadgeCheck className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name="contact_no"
                        placeholder="+94 77 123 4567"
                        onChange={handleChange}
                        required
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
                    <Calendar className="h-4 w-4" />
                    Hire Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="hire_date"
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Role Assignment */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Role Assignment</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Select Employee Role
                  </label>
                  <select
                    name="role"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="SALESPERSON">Salesperson</option>
                    <option value="MANAGER">Manager</option>
                    <option value="FACTORY_MANAGER">Factory Manager</option>
                 
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    This determines the employee's access level and permissions within the system.
                  </p>
                </div>
              </div>

              {/* Login Credentials */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Key className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-gray-900">Login Credentials</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name="username"
                        placeholder="johndoe"
                        onChange={handleChange}
                        required
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      />
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name="email"
                        type="email"
                        placeholder="john.doe@bakeryhub.com"
                        onChange={handleChange}
                        required
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      />
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        onChange={handleChange}
                        required
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      />
                      <Key className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500">
                      Minimum 8 characters with letters and numbers
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  } text-white shadow-lg hover:shadow-xl`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Create Employee Account
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="py-3.5 px-6 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>

              {/* Form Note */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  By creating this account, the employee will receive their login credentials via email.
                  <span className="block mt-1">All fields marked with <span className="text-red-500">*</span> are required.</span>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact system administrator at admin@bakeryhub.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSignup;