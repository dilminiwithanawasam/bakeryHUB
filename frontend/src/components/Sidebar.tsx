import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Bell, Truck, Package, LogOut, Sun, Moon } from 'lucide-react';
import logo from '../assets/bakeryHUB.png'; 
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme(); // ✅ This is correct now!

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/factory' },
    { name: 'Outlet Monitor', icon: BarChart2, path: '/factory/monitor' },
    { name: 'Notifications', icon: Bell, path: '/factory/notifications' },
    { name: 'Dispatch HUB', icon: Truck, path: '/factory/dispatch' },
    { name: 'Production entry', icon: Package, path: '/factory/production' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    // ✅ Added dark:bg-gray-900 and dark:border-gray-800
    <div className="w-64 bg-white dark:bg-gray-900 h-screen flex flex-col border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0 z-50 transition-colors duration-300">
      
      {/* Logo Section */}
      <div className="p-6 flex justify-center items-center">
        <img src={logo} alt="BakeryHUB" className="w-32 h-auto object-contain" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              // ✅ Added dark mode text/bg colors for active and hover states
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-black dark:text-white font-semibold bg-gray-100 dark:bg-gray-800' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium'
              }`}
            >
              <item.icon size={22} className={isActive ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-8 space-y-4">
        <button 
          onClick={handleLogout}
          // ✅ Added dark mode colors
          className="w-full flex items-center gap-4 px-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition font-medium"
        >
          <LogOut size={22} />
          <span>Logout</span>
        </button>

        {/* ✅ Added dark mode colors */}
        <div className="flex items-center justify-between px-2 pt-2 text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-4">
            {theme === 'light' ? <Sun size={22} /> : <Moon size={22} />}
            <span className="font-medium">{theme === 'light' ? 'Light mode' : 'Dark mode'}</span>
          </div>
          
          {/* TOGGLE SWITCH */}
          <div 
            onClick={toggleTheme}
            className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 ${
                theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-200'
            }`}
          >
             <div className={`w-5 h-5 bg-white rounded-full absolute top-0 border-2 border-transparent shadow-sm transform transition-transform duration-300 flex items-center justify-center ${
                 theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
             }`}>
                <span className="text-[10px]">{theme === 'dark' ? '🌙' : '☀️'}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;