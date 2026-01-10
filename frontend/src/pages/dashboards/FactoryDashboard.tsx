import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

interface DashboardStats {
  pendingCustomerOrders: number;
  batchesProduced: number;
  dispatchedOrders: number;
}

const FactoryDashboard = () => {
  const navigate = useNavigate(); // 2. Initialize the hook
  
  const [stats, setStats] = useState<DashboardStats>({
    pendingCustomerOrders: 0,
    batchesProduced: 0,
    dispatchedOrders: 0
  });

  // Fetch data when page loads
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/factory/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Common button style to keep code clean
  const buttonStyle = "w-full bg-[#D98850] hover:bg-[#c27640] text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition uppercase text-sm tracking-wide";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex transition-colors duration-300">
      
      <Sidebar />

      <main className="flex-1 ml-64 p-10">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-8">Dashboard</h1>

        {/* --- Top Stats --- */}
        <section className="mb-10">
          <h2 className="text-lg text-gray-800 dark:text-gray-300 mb-4">Today’s Overview</h2>
          <hr className="border-t border-orange-200 dark:border-gray-700 mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Pending customer Orders', value: stats.pendingCustomerOrders },
              { title: 'Batches Produced', value: stats.batchesProduced },
              { title: 'Dispatched outlet stock orders', value: stats.dispatchedOrders },
            ].map((card, index) => (
              <div key={index} className="bg-orange-50/50 dark:bg-gray-900 border border-orange-200 dark:border-gray-700 rounded-lg p-8 text-center shadow-sm">
                <h3 className="text-gray-700 dark:text-gray-400 text-lg mb-2">{card.title}</h3>
                <p className="text-3xl font-medium text-gray-900 dark:text-white">{card.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Bottom Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Quick Actions */}
          <div className="col-span-1">
             <h2 className="text-lg text-gray-800 dark:text-gray-300 mb-2">Quick Actions</h2>
             <hr className="border-t border-orange-200 dark:border-gray-700 mb-6" />

             <div className="space-y-4">
               
               {/* 3. Button: Add Inventory Batch (Links to BatchEntry) */}
               <button 
                 onClick={() => navigate('/factory/BatchEntry')} 
                 className={buttonStyle}
               >
                 Add Inventory Batch
               </button>

               {/* Button: Outlet Orders (Placeholder) */}
               <button className={buttonStyle}>
                 Outlet Orders
               </button>

               {/* Button: Customer Orders (Placeholder) */}
               <button className={buttonStyle}>
                 Customer Orders
               </button>

               {/* Button: Add New Product (Placeholder) */}
               <button className={buttonStyle}>
                 Add New Product
               </button>

             </div>
          </div>

          {/* Recent Activity */}
          <div className="col-span-2">
            <h2 className="text-lg text-gray-800 dark:text-gray-300 mb-2">Recent Activity</h2>
             <hr className="border-t border-orange-200 dark:border-gray-700 mb-6" />
             
             <div className="border border-orange-200 dark:border-gray-700 rounded-lg h-96 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 shadow-sm">
               No activities to show
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default FactoryDashboard;