import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800">📊 Analytics & Management</h1>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-red-600 font-bold">Logout</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm">Total Revenue</h3>
            <p className="text-2xl font-bold">Rs. 125,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <h3 className="text-gray-500 text-sm">Active Employees</h3>
            <p className="text-2xl font-bold">12</p>
        </div>
      </div>
      
      <button onClick={() => navigate('/signup-employee')} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
        + Register New Employee
      </button>
    </div>
  );
};
export default AdminDashboard;