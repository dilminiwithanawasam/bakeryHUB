import React, { useState } from 'react';
import { TrendingDown, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import FactoryManagerLayout from '../../components/FactoryManagerLayout';

interface OutletStock {
  id: string;
  name: string;
  location: string;
  stockHealth: 'Good' | 'Low' | 'Critical';
  lastReplenishment: string;
  pendingOrders: number;
  readyForDispatch: number;
  itemsInStock: { name: string; quantity: number; threshold: number }[];
  dispatchSchedule?: string;
}

const OutletMonitor: React.FC = () => {
  const [outlets] = useState<OutletStock[]>([
    {
      id: 'OUTLET-001',
      name: 'Downtown Bakery',
      location: 'Main Street',
      stockHealth: 'Good',
      lastReplenishment: '2026-02-06 09:30 AM',
      pendingOrders: 2,
      readyForDispatch: 1,
      itemsInStock: [
        { name: 'Croissants', quantity: 45, threshold: 30 },
        { name: 'Sourdough Bread', quantity: 28, threshold: 20 },
        { name: 'Chocolate Cake', quantity: 12, threshold: 15 },
        { name: 'Bagels', quantity: 60, threshold: 40 },
      ],
      dispatchSchedule: '6:00 AM Daily',
    },
    {
      id: 'OUTLET-002',
      name: 'Mall Location',
      location: 'Shopping Center',
      stockHealth: 'Good',
      lastReplenishment: '2026-02-06 08:00 AM',
      pendingOrders: 3,
      readyForDispatch: 2,
      itemsInStock: [
        { name: 'Donuts', quantity: 85, threshold: 60 },
        { name: 'Muffins', quantity: 55, threshold: 45 },
        { name: 'Bagels', quantity: 70, threshold: 50 },
        { name: 'Croissants', quantity: 40, threshold: 30 },
      ],
      dispatchSchedule: '7:00 AM & 2:00 PM',
    },
    {
      id: 'OUTLET-003',
      name: 'Airport Kiosk',
      location: 'Airport Terminal',
      stockHealth: 'Low',
      lastReplenishment: '2026-02-05 11:00 PM',
      pendingOrders: 1,
      readyForDispatch: 0,
      itemsInStock: [
        { name: 'Croissants', quantity: 18, threshold: 30 },
        { name: 'Coffee Cake', quantity: 8, threshold: 15 },
        { name: 'Bagels', quantity: 25, threshold: 40 },
        { name: 'Donuts', quantity: 10, threshold: 20 },
      ],
      dispatchSchedule: '6:00 AM, 12:00 PM, 6:00 PM',
    },
    {
      id: 'OUTLET-004',
      name: 'Park Street Store',
      location: 'Residential Area',
      stockHealth: 'Critical',
      lastReplenishment: '2026-02-04 10:00 AM',
      pendingOrders: 1,
      readyForDispatch: 0,
      itemsInStock: [
        { name: 'Rye Bread', quantity: 8, threshold: 20 },
        { name: 'Biscotti', quantity: 5, threshold: 30 },
        { name: 'Focaccia Bread', quantity: 3, threshold: 15 },
        { name: 'Croissants', quantity: 2, threshold: 30 },
      ],
      dispatchSchedule: '8:00 AM Daily',
    },
    {
      id: 'OUTLET-005',
      name: 'Central Hub',
      location: 'Downtown',
      stockHealth: 'Good',
      lastReplenishment: '2026-02-06 10:15 AM',
      pendingOrders: 2,
      readyForDispatch: 1,
      itemsInStock: [
        { name: 'Focaccia Bread', quantity: 32, threshold: 25 },
        { name: 'Tiramisu', quantity: 22, threshold: 15 },
        { name: 'Croissants', quantity: 50, threshold: 30 },
        { name: 'Bagels', quantity: 65, threshold: 45 },
      ],
      dispatchSchedule: '7:30 AM Daily',
    },
  ]);

  const [expandedOutlet, setExpandedOutlet] = useState<string | null>(null);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Good':
        return { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', badge: 'bg-green-100 text-green-800' };
      case 'Low':
        return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' };
      case 'Critical':
        return { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-100 text-red-800' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800' };
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'Good':
        return <CheckCircle className="text-green-600" size={24} />;
      case 'Low':
        return <TrendingDown className="text-yellow-600" size={24} />;
      case 'Critical':
        return <AlertTriangle className="text-red-600" size={24} />;
      default:
        return null;
    }
  };

  const goodOutlets = outlets.filter(o => o.stockHealth === 'Good').length;
  const lowOutlets = outlets.filter(o => o.stockHealth === 'Low').length;
  const criticalOutlets = outlets.filter(o => o.stockHealth === 'Critical').length;
  const totalPendingOrders = outlets.reduce((sum, o) => sum + o.pendingOrders, 0);

  return (
    <FactoryManagerLayout>
      <div className="p-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Outlet Monitor</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring of outlet stock levels and dispatch status</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Good Stock</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{goodOutlets}</p>
            <p className="text-xs text-gray-500 mt-1">Outlets optimized</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600">Low Stock</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{lowOutlets}</p>
            <p className="text-xs text-gray-500 mt-1">Needs replenishment</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
            <p className="text-sm text-gray-600">Critical</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{criticalOutlets}</p>
            <p className="text-xs text-gray-500 mt-1">Urgent action needed</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Pending Orders</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{totalPendingOrders}</p>
            <p className="text-xs text-gray-500 mt-1">In preparation</p>
          </div>
        </div>

        {/* Outlets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {outlets.map((outlet) => {
            const colors = getHealthColor(outlet.stockHealth);
            const isExpanded = expandedOutlet === outlet.id;
            const lowStockItems = outlet.itemsInStock.filter(item => item.quantity <= item.threshold);

            return (
              <div key={outlet.id} className={`rounded-lg shadow-md border-2 ${colors.border} overflow-hidden`}>
                {/* Header */}
                <div className={`${colors.bg} p-4 border-b-2 ${colors.border}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getHealthIcon(outlet.stockHealth)}
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{outlet.name}</h3>
                          <p className="text-sm text-gray-600">{outlet.location}</p>
                        </div>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
                        {outlet.stockHealth} Stock
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="p-4 bg-white border-b grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{outlet.pendingOrders}</p>
                    <p className="text-xs text-gray-600">Pending Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{outlet.readyForDispatch}</p>
                    <p className="text-xs text-gray-600">Ready to Ship</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{outlet.itemsInStock.length}</p>
                    <p className="text-xs text-gray-600">Product Types</p>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Last Replenishment</p>
                    <p className="font-medium text-gray-800 flex items-center gap-2">
                      <RefreshCw size={14} className="text-blue-600" />
                      {outlet.lastReplenishment}
                    </p>
                  </div>

                  {outlet.dispatchSchedule && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-gray-600">Dispatch Schedule</p>
                      <p className="font-medium text-blue-700 text-sm">{outlet.dispatchSchedule}</p>
                    </div>
                  )}

                  {lowStockItems.length > 0 && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-xs text-gray-600 font-semibold">⚠️ {lowStockItems.length} Item(s) Below Threshold</p>
                      <ul className="text-xs text-yellow-800 mt-1 space-y-1">
                        {lowStockItems.map((item, idx) => (
                          <li key={idx}>{item.name}: {item.quantity} / {item.threshold}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedOutlet(isExpanded ? null : outlet.id)}
                    className="w-full text-blue-600 hover:text-blue-800 font-medium text-sm py-2"
                  >
                    {isExpanded ? '▼ Hide Details' : '▶ View Stock Details'}
                  </button>
                </div>

                {/* Expanded Stock Details */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-4">
                    <h4 className="font-bold text-gray-800 mb-3">Current Stock Levels</h4>
                    <div className="space-y-2">
                      {outlet.itemsInStock.map((item, idx) => {
                        const percentage = (item.quantity / item.threshold) * 100;
                        const isLow = item.quantity <= item.threshold;

                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">{item.name}</span>
                              <span className={`text-sm font-bold ${isLow ? 'text-orange-600' : 'text-green-600'}`}>
                                {item.quantity} / {item.threshold}
                              </span>
                            </div>
                            <div className="w-full bg-gray-300 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  percentage > 100 ? 'bg-green-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </FactoryManagerLayout>
  );
};

export default OutletMonitor;
