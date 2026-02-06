import React, { useState, useEffect } from 'react';
import { BarChart3, Users, ShoppingCart, TrendingUp, Settings, LogOut, Menu, X } from 'lucide-react';
import api from '../../api/axios';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  orderGrowth: number;
}

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard-stats/');
      setStats(response.data);
      setError('');
    } catch (err) {
      // If the endpoint doesn't exist on this backend, fall back to placeholder stats
      // Avoid noisy console output in the browser devtools while still capturing error details optionally on the server
      // (404 commonly occurs when the backend admin endpoints are not enabled in development)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e: any = err;
      if (e?.response?.status === 404) {
        setStats({ totalUsers: 0, totalOrders: 0, totalRevenue: 0, orderGrowth: 0 });
        setError('Admin stats endpoint not available; showing placeholders.');
      } else {
        setError('Failed to load dashboard statistics');
        console.error('Admin dashboard error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon size={28} style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>BakeryHUB Admin</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          <a
            href="#"
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition"
          >
            <BarChart3 size={20} />
            <span className={!sidebarOpen ? 'hidden' : ''}>Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Users size={20} />
            <span className={!sidebarOpen ? 'hidden' : ''}>Users</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition"
          >
            <ShoppingCart size={20} />
            <span className={!sidebarOpen ? 'hidden' : ''}>Orders</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Settings size={20} />
            <span className={!sidebarOpen ? 'hidden' : ''}>Settings</span>
          </a>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-red-600 transition text-white"
          >
            <LogOut size={20} />
            <span className={!sidebarOpen ? 'hidden' : ''}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-600 text-sm">Welcome back! Here's your bakery overview.</p>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600 text-lg">Loading dashboard...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={Users}
                  title="Total Users"
                  value={stats?.totalUsers || 0}
                  color="#3B82F6"
                />
                <StatCard
                  icon={ShoppingCart}
                  title="Total Orders"
                  value={stats?.totalOrders || 0}
                  color="#10B981"
                />
                <StatCard
                  icon={TrendingUp}
                  title="Total Revenue"
                  value={`$${stats?.totalRevenue || 0}`}
                  color="#F59E0B"
                />
                <StatCard
                  icon={BarChart3}
                  title="Order Growth"
                  value={`${stats?.orderGrowth || 0}%`}
                  color="#8B5CF6"
                />
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Order ID</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Amount</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800">#12345</td>
                        <td className="px-4 py-3 text-gray-800">John Doe</td>
                        <td className="px-4 py-3 text-gray-800">$45.99</td>
                        <td className="px-4 py-3">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                            Completed
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800">#12346</td>
                        <td className="px-4 py-3 text-gray-800">Jane Smith</td>
                        <td className="px-4 py-3 text-gray-800">$32.50</td>
                        <td className="px-4 py-3">
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                            Pending
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
