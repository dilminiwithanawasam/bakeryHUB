import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Clock } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

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
    <div
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-gray-900 text-white transition-all duration-300 flex flex-col shadow-lg fixed left-0 top-0 h-screen z-50`}
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

      {/* Date/Time Display */}
      {sidebarOpen && (
        <div className="px-4 py-3 mx-2 mt-2 bg-gray-800 rounded-lg text-xs text-gray-300 text-center border border-gray-700">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock size={14} />
            <span className="font-mono">{currentTime}</span>
          </div>
          <div className="text-xs text-gray-400">{currentDate}</div>
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
  );
};

export default Sidebar;