import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">

      <AdminSidebar/>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* Header Container */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          
          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, Admin. Here is what's happening today.
            </p>
          </div>

          {/* IMPROVED LOGOUT UI: User Profile Pill */}
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 bg-white pl-2 pr-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:border-red-100 hover:bg-red-50 transition-all duration-300"
            title="Click to Logout"
          >
            {/* Avatar Circle */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:from-red-500 group-hover:to-red-600 transition-colors">
              AD
            </div>

            {/* User Info & Logout Text */}
            <div className="text-left hidden sm:block">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Logged in as
              </p>
              <p className="text-sm font-bold text-gray-700 group-hover:text-red-700 transition-colors">
                Administrator
              </p>
            </div>

            {/* Logout Icon (SVG) */}
            <div className="ml-2 text-gray-300 group-hover:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          </button>
        </div>

        {/* Stats Grid - Now 3 cards instead of 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Revenue */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <span className="text-xl">💰</span>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
            </div>
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Revenue</h3>
            <p className="text-2xl font-black text-gray-800">Rs. 125,000</p>
          </div>

          {/* Employees */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <span className="text-xl">👔</span>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Active</span>
            </div>
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Staff</h3>
            <p className="text-2xl font-black text-gray-800">12</p>
          </div>

          {/* Roles */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <span className="text-xl">🔐</span>
              </div>
            </div>
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Access Roles</h3>
            <p className="text-2xl font-black text-gray-800">4</p>
          </div>
        </div>

        {/* Charts & Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              Revenue Analytics
            </h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm font-medium">
              Chart Component Area
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
              Role Distribution
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Admin', count: 1, color: 'bg-blue-500' },
                { label: 'Sales Staff', count: 6, color: 'bg-green-500' },
                { label: 'Inventory', count: 3, color: 'bg-yellow-500' },
                { label: 'Cashiers', count: 2, color: 'bg-red-500' }
              ].map((role) => (
                <div key={role.label} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${role.color}`}></span>
                    <span className="text-sm font-medium text-gray-600">{role.label}</span>
                  </div>
                  <span className="font-bold text-gray-800">{role.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Manage Your Team</h2>
            <p className="text-blue-100 text-sm max-w-md">
              Need to add more staff members? You can register new employees and assign specific roles to them immediately.
            </p>
          </div>
          <button
            onClick={() => navigate('/signup-employee')}
            className="bg-white text-blue-700 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition font-bold transform hover:-translate-y-1"
          >
            + Register Employee
          </button>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;