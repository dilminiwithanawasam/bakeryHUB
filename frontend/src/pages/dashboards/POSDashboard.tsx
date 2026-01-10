
import { useNavigate } from 'react-router-dom';

const POSDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="p-8 bg-green-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-800">🛒 Point of Sale</h1>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-red-600 font-bold">Logout</button>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Placeholder for POS Grid */}
        <div className="h-32 bg-white rounded shadow flex items-center justify-center border-2 border-green-200">Breads</div>
        <div className="h-32 bg-white rounded shadow flex items-center justify-center border-2 border-green-200">Pastries</div>
        <div className="h-32 bg-white rounded shadow flex items-center justify-center border-2 border-green-200">Drinks</div>
      </div>
    </div>
  );
};
export default POSDashboard;