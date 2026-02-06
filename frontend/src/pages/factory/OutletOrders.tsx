import React, { useState } from 'react';
import { Truck, CheckCircle, AlertCircle } from 'lucide-react';
import FactoryManagerLayout from '../../components/FactoryManagerLayout';

interface OutletOrder {
  id: string;
  outletName: string;
  outletId: string;
  orderDate: string;
  items: { name: string; quantity: number; unit: string }[];
  status: 'Pending' | 'Dispatched' | 'Received' | 'Closed';
  totalItems: number;
  notes?: string;
}

const OutletOrders: React.FC = () => {
  const [orders, setOrders] = useState<OutletOrder[]>([
    {
      id: 'ORD-2026-001',
      outletName: 'Downtown Bakery',
      outletId: 'OUTLET-001',
      orderDate: '2026-02-06',
      items: [
        { name: 'Croissants', quantity: 50, unit: 'pieces' },
        { name: 'Sourdough Bread', quantity: 30, unit: 'loaves' },
        { name: 'Chocolate Cake', quantity: 15, unit: 'pieces' },
      ],
      status: 'Pending',
      totalItems: 95,
    },
    {
      id: 'ORD-2026-002',
      outletName: 'Mall Location',
      outletId: 'OUTLET-002',
      orderDate: '2026-02-06',
      items: [
        { name: 'Bagels', quantity: 75, unit: 'pieces' },
        { name: 'Donuts', quantity: 100, unit: 'pieces' },
        { name: 'Muffins', quantity: 60, unit: 'pieces' },
      ],
      status: 'Pending',
      totalItems: 235,
    },
    {
      id: 'ORD-2026-003',
      outletName: 'Airport Kiosk',
      outletId: 'OUTLET-003',
      orderDate: '2026-02-05',
      items: [
        { name: 'Croissants', quantity: 40, unit: 'pieces' },
        { name: 'Coffee Cake', quantity: 20, unit: 'pieces' },
      ],
      status: 'Dispatched',
      totalItems: 60,
      notes: 'Dispatched at 10:30 AM',
    },
    {
      id: 'ORD-2026-004',
      outletName: 'Park Street Store',
      outletId: 'OUTLET-004',
      orderDate: '2026-02-05',
      items: [
        { name: 'Rye Bread', quantity: 25, unit: 'loaves' },
        { name: 'Biscotti', quantity: 80, unit: 'pieces' },
      ],
      status: 'Received',
      totalItems: 105,
    },
    {
      id: 'ORD-2026-005',
      outletName: 'Central Hub',
      outletId: 'OUTLET-005',
      orderDate: '2026-02-04',
      items: [
        { name: 'Focaccia Bread', quantity: 35, unit: 'pieces' },
        { name: 'Tiramisu', quantity: 25, unit: 'pieces' },
      ],
      status: 'Closed',
      totalItems: 60,
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<OutletOrder | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handlePrepareOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'Dispatched' as const } : order
    ));
  };

  const handleDispatchOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'Received' as const } : order
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Dispatched':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Received':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Closed':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <AlertCircle size={16} />;
      case 'Dispatched':
        return <Truck size={16} />;
      case 'Received':
        return <CheckCircle size={16} />;
      case 'Closed':
        return <CheckCircle size={16} />;
      default:
        return null;
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const dispatchedOrders = orders.filter(o => o.status === 'Dispatched').length;

  return (
    <FactoryManagerLayout>
      <div className="p-8 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Outlet Orders</h1>
            <p className="text-gray-600 mt-1">System-generated daily replenishment orders from outlets</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-red-600">{pendingOrders}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-yellow-600">{dispatchedOrders}</p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Order ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Outlet</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Order Date</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Items</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-800">{order.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{order.outletName}</p>
                        <p className="text-xs text-gray-500">{order.outletId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{order.orderDate}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        {order.totalItems} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)} w-fit text-sm font-medium`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetails(true);
                        }}
                        className="block text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View Items
                      </button>
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => handlePrepareOrder(order.id)}
                          className="block text-orange-600 hover:text-orange-800 font-medium text-sm"
                        >
                          Prepare Order
                        </button>
                      )}
                      {order.status === 'Dispatched' && (
                        <button
                          onClick={() => handleDispatchOrder(order.id)}
                          className="block text-green-600 hover:text-green-800 font-medium text-sm"
                        >
                          Mark Dispatched
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-500 text-white p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">Order Details - {selectedOrder.id}</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Outlet</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.outletName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.orderDate}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold text-gray-800 mb-3">Items to Prepare:</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="font-semibold text-orange-600">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="text-gray-800">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </FactoryManagerLayout>
  );
};

export default OutletOrders;
