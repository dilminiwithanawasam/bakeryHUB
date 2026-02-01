import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

// Backend interfaces (UNCHANGED)
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

  const [data, setData] = useState<DashboardData>({
    pendingCustomerOrders: 0,
    batchesProduced: 0,
    dispatchedOrders: 0,
    recentActivity: []
  });

  const [loading, setLoading] = useState(true);

  // Animated counters
  const [animated, setAnimated] = useState({
    pending: 0,
    produced: 0,
    dispatched: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/factory/stats');
        setData({
          ...response.data,
          recentActivity: Array.isArray(response.data.recentActivity)
            ? response.data.recentActivity
            : []
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Counter animation logic
  useEffect(() => {
    const animate = (key: keyof typeof animated, target: number) => {
      let start = 0;
      const interval = setInterval(() => {
        start += Math.ceil(target / 25);
        if (start >= target) {
          start = target;
          clearInterval(interval);
        }
        setAnimated(prev => ({ ...prev, [key]: start }));
      }, 30);
    };

    animate('pending', data.pendingCustomerOrders);
    animate('produced', data.batchesProduced);
    animate('dispatched', data.dispatchedOrders);
  }, [data]);

  const buttonStyle =
    "w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all uppercase tracking-wide";

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Sidebar />

      <main className="flex-1 ml-64 p-10 animate-fade-in">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Factory Control Center 🏭
          </h1>
          <p className="text-gray-500 mt-2">
            Today’s production, dispatch & outlet coordination
          </p>
        </div>

        {/* Stats */}
        <section className="mb-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Pending Orders */}
            <div className="relative bg-white border-l-8 border-orange-500 rounded-3xl p-8 shadow-lg hover:scale-[1.02] transition">
              <span className="absolute top-4 right-5 text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold">
                TODAY
              </span>
              <h3 className="text-sm text-gray-500 font-semibold">
                Pending Customer Orders
              </h3>
              <p className="text-5xl font-extrabold text-orange-600 mt-3 animate-pulse">
                {animated.pending}
              </p>
              <p className="text-xs mt-2 text-gray-400">
                Requires dispatch planning
              </p>
            </div>

            {/* Batches Produced */}
            <div className="relative bg-white border-l-8 border-blue-500 rounded-3xl p-8 shadow-lg hover:scale-[1.02] transition">
              <h3 className="text-sm text-gray-500 font-semibold">
                Batches Produced
              </h3>
              <p className="text-5xl font-extrabold text-blue-600 mt-3">
                {animated.produced}
              </p>
              <p className="text-xs mt-2 text-gray-400">
                Completed factory output
              </p>
            </div>

            {/* Dispatched */}
            <div className="relative bg-white border-l-8 border-green-500 rounded-3xl p-8 shadow-lg hover:scale-[1.02] transition">
              <span className="absolute top-4 right-5 text-green-600 text-xl">✔</span>
              <h3 className="text-sm text-gray-500 font-semibold">
                Orders Dispatched
              </h3>
              <p className="text-5xl font-extrabold text-green-600 mt-3">
                {animated.dispatched}
              </p>
              <p className="text-xs mt-2 text-gray-400">
                Sent to outlets & customers
              </p>
            </div>

          </div>
        </section>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Actions */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Factory Actions
            </h2>
            <div className="bg-white rounded-3xl p-6 space-y-4 shadow-lg">
              <button onClick={() => navigate('/factory/BatchEntry')} className={buttonStyle}>
                ➕ Add Inventory Batch
              </button>
              <button onClick={() => alert('Outlet Orders coming soon')} className={buttonStyle}>
                🏪 Outlet Orders
              </button>
              <button onClick={() => alert('Customer Orders coming soon')} className={buttonStyle}>
                🛒 Customer Orders
              </button>
              <button onClick={() => navigate('/factory/AddProduct')} className={buttonStyle}>
                📦 Add New Product
              </button>
            </div>
          </div>

          {/* Activity */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">
              Live Factory Activity
            </h2>

            <div className="bg-white rounded-3xl shadow-lg p-6 max-h-[520px] overflow-y-auto">
              {loading ? (
                <p className="text-center text-gray-400 mt-20">
                  Loading factory updates...
                </p>
              ) : data.recentActivity.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                  <span className="text-5xl mb-3">📭</span>
                  No activities recorded today
                </div>
              ) : (
                <ul className="space-y-4">
                  {data.recentActivity.map(activity => (
                    <li
                      key={activity.id}
                      className="p-5 rounded-2xl bg-orange-50 border-l-4 border-orange-500 hover:shadow-md transition"
                    >
                      <p className="font-bold text-sm uppercase tracking-wide">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.details}
                      </p>
                      <span className="text-xs text-gray-500 mt-2 inline-block">
                        {new Date(activity.time).toLocaleString()}
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
