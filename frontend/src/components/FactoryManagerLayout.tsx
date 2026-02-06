import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, Clock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const FactoryManagerLayout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Dashboard', path: '/factory-manager', icon: '📊' },
    { label: 'Batches', path: '/factory-manager/batches', icon: '📦' },
    { label: 'Outlet Orders', path: '/factory-manager/outlet-orders', icon: '🚚' },
    { label: 'Customer Orders', path: '/factory-manager/customer-orders', icon: '🛒' },
    { label: 'Outlet Monitor', path: '/factory-manager/outlet-monitor', icon: '📡' },
    { label: 'Products', path: '/factory-manager/products', icon: '🍰' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between h-20">
          <h1 className={`font-bold text-lg ${!sidebarOpen && 'hidden'}`}>BakeryHUB</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-800 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Role Badge */}
        {sidebarOpen && (
          <div className="px-4 py-2 mx-2 mt-2 bg-orange-600 rounded-lg text-xs font-bold text-center">
            FACTORY MANAGER
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-orange-600 text-white'
                  : 'hover:bg-gray-800 text-gray-300 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className={!sidebarOpen ? 'hidden' : ''}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-600 transition text-gray-300 hover:text-white"
          >
            <LogOut size={20} />
            <span className={!sidebarOpen ? 'hidden' : ''}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md h-20 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Factory Manager</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">John Anderson</p>
              <p className="text-xs text-gray-500">Factory Manager</p>
            </div>
            <div className="border-l border-gray-300 pl-6">
              <div className="flex items-center gap-2 text-right">
                <Clock size={16} className="text-orange-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">{currentTime}</p>
                  <p className="text-xs text-gray-500">{currentDate}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FactoryManagerLayout;
