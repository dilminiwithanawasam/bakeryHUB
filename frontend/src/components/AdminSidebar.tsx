import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col z-10">
      
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-extrabold text-blue-700 tracking-tight">
          bakeryHUB
        </h2>
        <p className="text-xs text-gray-500 mt-1 font-medium">
          System Control Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 text-sm">

        <SidebarItem
          label="Dashboard"
          icon="📊"
          onClick={() => navigate('/admin/dashboard')}
          active
        />

        <SidebarItem
          label="Register Employee"
          icon="👤"
          onClick={() => navigate('/signup-employee')}
        />

        <SidebarItem
          label="Users"
          icon="👥"
          onClick={() => navigate('/employee/EmployeeListView')}
        />

        <SidebarItem
          label="Roles & Permissions"
          icon="🔐"
          onClick={() => navigate('/admin/roles')}
        />

        <SidebarItem
          label="Reports"
          icon="📁"
          onClick={() => navigate('/admin/reports')}
        />

        <SidebarItem
          label="Settings"
          icon="⚙️"
          onClick={() => navigate('/admin/settings')}
        />

      </nav>
    </aside>
  );
};

export default AdminSidebar;

/* ------------------------------------ */
/* Sidebar Item Component (Reusable)    */
/* ------------------------------------ */

type SidebarItemProps = {
  label: string;
  icon: string;
  onClick: () => void;
  active?: boolean;
};

const SidebarItem = ({ label, icon, onClick, active }: SidebarItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`px-3 py-2.5 rounded-lg flex items-center gap-3 cursor-pointer transition
        ${active
          ? 'bg-blue-50 text-blue-700 font-bold'
          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
        }`}
    >
      <span>{icon}</span>
      {label}
    </div>
  );
};
