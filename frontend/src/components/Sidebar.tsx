import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Bell, Truck, Package, LogOut } from 'lucide-react';
import logo from '../assets/bakeryHUB.png'; 


const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
 

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

        
      </div>
    </div>
  );
};

export default Sidebar;