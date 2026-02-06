import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FactoryManagerLayout from '../../components/FactoryManagerLayout';

interface DashboardStats {
  urgentOrders: number;
  outletOrdersPending: number;
  criticalStockOutlets: number;
}

const FactoryManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats] = useState<DashboardStats>({
    urgentOrders: 4,
    outletOrdersPending: 2,
    criticalStockOutlets: 1,
  });

  return (
    <FactoryManagerLayout>
      <div className="p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-lg bg-gradient-to-r from-orange-600 to-red-500 shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome Back, John Anderson</h2>
          <p className="text-orange-100">Factory Manager • Production Status: All Systems Operational</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Urgent Orders</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.urgentOrders}</p>
                <p className="text-xs text-gray-500 mt-2">Require immediate attention</p>
              </div>
              <AlertTriangle size={32} className="text-red-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Outlet Orders</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.outletOrdersPending}</p>
                <p className="text-xs text-gray-500 mt-2">Currently pending</p>
              </div>
              <Package size={32} className="text-yellow-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Critical Stock</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.criticalStockOutlets}</p>
                <p className="text-xs text-gray-500 mt-2">Outlets need restocking</p>
              </div>
              <TrendingUp size={32} className="text-orange-600 opacity-20" />
            </div>
          </div>

        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Urgent Customer Orders */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4">
              <h3 className="font-bold text-lg">⚡ Urgent Customer Orders</h3>
              <p className="text-sm text-red-100">Orders due within 24 hours</p>
            </div>
            <div className="p-6 space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-bold text-gray-800">Wedding Cake - 3 Tier</p>
                <p className="text-xs text-gray-600">Sarah Johnson • Due 2:00 PM TODAY</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-bold text-gray-800">Custom Birthday Cake</p>
                <p className="text-xs text-gray-600">James Rodriguez • Due 5:30 PM TODAY</p>
              </div>
              <button
                onClick={() => navigate('/factory-manager/customer-orders')}
                className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
              >
                View All Urgent Orders
              </button>
            </div>
          </div>

          {/* Outlet Orders Status */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-4">
              <h3 className="font-bold text-lg">🚚 Outlet Replenishment</h3>
              <p className="text-sm text-yellow-100">System-generated daily orders</p>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-bold text-gray-800">Pending</p>
                  <p className="text-lg font-bold text-yellow-600">2 Orders</p>
                </div>
                <Clock className="text-yellow-600" size={32} />
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-bold text-gray-800">Ready for Dispatch</p>
                  <p className="text-lg font-bold text-green-600">1 Order</p>
                </div>
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <button
                onClick={() => navigate('/factory-manager/outlet-orders')}
                className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Manage Outlet Orders
              </button>
            </div>
          </div>

          {/* Stock Alert */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4">
              <h3 className="font-bold text-lg">📡 Outlet Stock Monitor</h3>
              <p className="text-sm text-orange-100">Real-time stock levels</p>
            </div>
            <div className="p-6 space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border border-red-300">
                <p className="text-sm font-bold text-red-800">Critical</p>
                <p className="text-xs text-red-600">Park Street Store - Very Low Stock</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-300">
                <p className="text-sm font-bold text-yellow-800">Low Stock</p>
                <p className="text-xs text-yellow-600">Airport Kiosk - Needs Replenishment</p>
              </div>
              <button
                onClick={() => navigate('/factory-manager/outlet-monitor')}
                className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Monitor Stock Levels
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Product Button */}
          <button
            onClick={() => navigate('/factory/AddProduct')}
            className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-300 hover:border-blue-500 hover:shadow-lg transition text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-800">➕ Add New Product</h3>
                <p className="text-sm text-gray-600 mt-2">Create new bakery products for production</p>
              </div>
              <Package className="text-blue-600" size={40} />
            </div>
          </button>

          {/* Add Batch Button */}
          <button
            onClick={() => navigate('/factory/BatchEntry')}
            className="bg-white rounded-lg shadow-md p-6 border-2 border-orange-300 hover:border-orange-500 hover:shadow-lg transition text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-800">📦 Create Production Batch</h3>
                <p className="text-sm text-gray-600 mt-2">Start a new batch for factory production</p>
              </div>
              <BarChart3 className="text-orange-600" size={40} />
            </div>
          </button>
        </div>
      </div>
    </FactoryManagerLayout>
  );
};

export default FactoryManagerDashboard;
