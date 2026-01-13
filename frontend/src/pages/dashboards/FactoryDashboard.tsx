import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

// 1. Interface matching the FIXED Backend Controller response
interface Activity {
  id: number;
  action: string;
  details: string;
  time: string;
}

interface DashboardData {
  pendingCustomerOrders: number;
  batchesProduced: number;
  dispatchedOrders: number;
  recentActivity: Activity[];
}

const FactoryDashboard = () => {
  const navigate = useNavigate();
  
  // 2. Initialize State with safe defaults
  const [data, setData] = useState<DashboardData>({
    pendingCustomerOrders: 0,
    batchesProduced: 0,
    dispatchedOrders: 0,
    recentActivity: [] 
  });

  const [loading, setLoading] = useState(true);

  // 3. Fetch Data from Backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/factory/stats');
        // Ensure recentActivity is always an array to prevent crashes
        const safeData = {
            ...response.data,
            recentActivity: Array.isArray(response.data.recentActivity) ? response.data.recentActivity : []
        };
        setData(safeData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Common button style
  const buttonStyle = "w-full bg-[#D98850] hover:bg-[#c27640] text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition uppercase text-sm tracking-wide";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      <main className="flex-1 ml-64 p-10">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-8">Dashboard</h1>

        {/* --- Top Stats Section --- */}
        <section className="mb-10">
          <h2 className="text-lg text-gray-800 dark:text-gray-300 mb-4">Today’s Overview</h2>
          <hr className="border-t border-orange-200 dark:border-gray-700 mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Pending Customer Orders', value: data.pendingCustomerOrders },
              { title: 'Batches Produced', value: data.batchesProduced },
              { title: 'Dispatched Orders', value: data.dispatchedOrders },
            ].map((card, index) => (
              <div key={index} className="bg-orange-50/50 dark:bg-gray-900 border border-orange-200 dark:border-gray-700 rounded-lg p-8 text-center shadow-sm hover:shadow-md transition">
                <h3 className="text-gray-700 dark:text-gray-400 text-lg mb-2">{card.title}</h3>
                <p className="text-4xl font-medium text-gray-900 dark:text-white">{card.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Bottom Section (Actions & Activity) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Quick Actions */}
          <div className="col-span-1">
             <h2 className="text-lg text-gray-800 dark:text-gray-300 mb-2">Quick Actions</h2>
             <hr className="border-t border-orange-200 dark:border-gray-700 mb-6" />

             <div className="space-y-4">
               <button onClick={() => navigate('/factory/BatchEntry')} className={buttonStyle}>
                 Add Inventory Batch
               </button>
               <button className={buttonStyle} onClick={() => alert('Outlet Orders coming soon')}>
                 Outlet Orders
               </button>
               <button className={buttonStyle} onClick={() => alert('Customer Orders coming soon')}>
                 Customer Orders
               </button>
               <button onClick={() => navigate('/factory/AddProduct')} className={buttonStyle}>
                 Add New Product
               </button>
             </div>
          </div>

          {/* Right Column: Recent Activity Feed */}
          <div className="col-span-2">
            <h2 className="text-lg text-gray-800 dark:text-gray-300 mb-2">Recent Activity</h2>
             <hr className="border-t border-orange-200 dark:border-gray-700 mb-6" />
             
             <div className="border border-orange-200 dark:border-gray-700 rounded-lg min-h-[380px] bg-white dark:bg-gray-900 shadow-sm p-6 overflow-y-auto max-h-[500px]">
               
               {loading ? (
                 <p className="text-center text-gray-500 mt-10">Loading activities...</p>
               ) : data.recentActivity.length === 0 ? (
                 <div className="h-full flex items-center justify-center text-gray-400">
                    No recent activities found. Start by creating a batch!
                 </div>
               ) : (
                 <ul className="space-y-4">
                   {data.recentActivity.map((activity) => (
                     <li key={activity.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-[#D98850] hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                       <div>
                         <p className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wide">
                            {activity.action}
                         </p>
                         <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            {activity.details}
                         </p>
                       </div>
                       <span className="text-xs text-gray-400 font-medium bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                         {new Date(activity.time).toLocaleDateString()}
                       </span>
                     </li>
                   ))}
                 </ul>
               )}

             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default FactoryDashboard;