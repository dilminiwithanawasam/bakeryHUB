import React, { useState, useMemo } from 'react';
import { AlertTriangle, Clock, MapPin, Phone } from 'lucide-react';
import FactoryManagerLayout from '../../components/FactoryManagerLayout';

interface CustomerOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  product: string;
  quantity: number;
  pickupOutlet: string;
  pickupDate: string;
  pickupTime: string;
  priority: 'Urgent' | 'Normal';
  orderDate: string;
  notes?: string;
}

const CustomerOrders: React.FC = () => {
  const [orders] = useState<CustomerOrder[]>([
    {
      id: 'CUST-001',
      customerName: 'Sarah Johnson',
      customerPhone: '(555) 123-4567',
      product: 'Wedding Cake - 3 Tier',
      quantity: 1,
      pickupOutlet: 'Downtown Bakery',
      pickupDate: '2026-02-06',
      pickupTime: '02:00 PM',
      priority: 'Urgent',
      orderDate: '2026-02-04',
      notes: 'Pickup TODAY - Event at 4 PM',
    },
    {
      id: 'CUST-002',
      customerName: 'Michael Chen',
      customerPhone: '(555) 234-5678',
      product: 'Sourdough Bread',
      quantity: 2,
      pickupOutlet: 'Mall Location',
      pickupDate: '2026-02-06',
      pickupTime: '06:00 PM',
      priority: 'Urgent',
      orderDate: '2026-02-05',
      notes: 'Dinner party tonight',
    },
    {
      id: 'CUST-003',
      customerName: 'Emma Wilson',
      customerPhone: '(555) 345-6789',
      product: 'Chocolate Croissants',
      quantity: 1,
      pickupOutlet: 'Downtown Bakery',
      pickupDate: '2026-02-07',
      pickupTime: '10:00 AM',
      priority: 'Normal',
      orderDate: '2026-02-03',
    },
    {
      id: 'CUST-004',
      customerName: 'James Rodriguez',
      customerPhone: '(555) 456-7890',
      product: 'Custom Birthday Cake',
      quantity: 1,
      pickupOutlet: 'Park Street Store',
      pickupDate: '2026-02-06',
      pickupTime: '05:30 PM',
      priority: 'Urgent',
      orderDate: '2026-02-04',
      notes: 'Birthday party at 6:30 PM',
    },
    {
      id: 'CUST-005',
      customerName: 'Lisa Anderson',
      customerPhone: '(555) 567-8901',
      product: 'Bagels Assortment',
      quantity: 1,
      pickupOutlet: 'Airport Kiosk',
      pickupDate: '2026-02-08',
      pickupTime: '08:00 AM',
      priority: 'Normal',
      orderDate: '2026-02-05',
    },
    {
      id: 'CUST-006',
      customerName: 'David Thompson',
      customerPhone: '(555) 678-9012',
      product: 'Muffins - Blueberry (Dozen)',
      quantity: 1,
      pickupOutlet: 'Central Hub',
      pickupDate: '2026-02-06',
      pickupTime: '11:00 AM',
      priority: 'Urgent',
      orderDate: '2026-02-06',
      notes: 'Office meeting - ASAP',
    },
    {
      id: 'CUST-007',
      customerName: 'Jessica Martinez',
      customerPhone: '(555) 789-0123',
      product: 'Croissants (Box of 12)',
      quantity: 1,
      pickupOutlet: 'Mall Location',
      pickupDate: '2026-02-09',
      pickupTime: '02:00 PM',
      priority: 'Normal',
      orderDate: '2026-02-06',
    },
    {
      id: 'CUST-008',
      customerName: 'Robert Lee',
      customerPhone: '(555) 890-1234',
      product: 'Focaccia Bread (2 loaves)',
      quantity: 1,
      pickupOutlet: 'Downtown Bakery',
      pickupDate: '2026-02-07',
      pickupTime: '11:30 AM',
      priority: 'Normal',
      orderDate: '2026-02-05',
    },
  ]);

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Sort orders by urgency: Urgent first, then by pickup date/time
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority === 'Urgent' ? -1 : 1;
      }
      const dateComparison = new Date(`${a.pickupDate} ${a.pickupTime}`).getTime() - 
                            new Date(`${b.pickupDate} ${b.pickupTime}`).getTime();
      return dateComparison;
    });
  }, [orders]);

  const urgentCount = sortedOrders.filter(o => o.priority === 'Urgent').length;
  const normalCount = sortedOrders.filter(o => o.priority === 'Normal').length;

  const isUrgent = (pickupDate: string, pickupTime: string) => {
    const pickupDateTime = new Date(`${pickupDate} ${pickupTime}`);
    const now = new Date();
    const hoursDiff = (pickupDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  };

  return (
    <FactoryManagerLayout>
      <div className="p-8 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Customer Orders</h1>
            <p className="text-gray-600 mt-1">Orders sorted by urgency - earliest pickup dates appear first</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Urgent Orders</p>
              <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Normal Orders</p>
              <p className="text-2xl font-bold text-blue-600">{normalCount}</p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {sortedOrders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const urgent = isUrgent(order.pickupDate, order.pickupTime);

            return (
              <div
                key={order.id}
                className={`rounded-lg shadow-md overflow-hidden transition border-l-4 ${
                  order.priority === 'Urgent'
                    ? 'border-l-red-600 bg-red-50'
                    : 'border-l-gray-600 bg-white'
                }`}
              >
                {/* Main Order Card */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full p-6 hover:bg-opacity-80 transition text-left flex items-center justify-between"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-800">{order.id}</h3>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                            order.priority === 'Urgent'
                              ? 'bg-red-200 text-red-800'
                              : 'bg-blue-200 text-blue-800'
                          }`}
                        >
                          {order.priority === 'Urgent' && <AlertTriangle size={12} />}
                          {order.priority}
                        </span>
                        {urgent && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-200 text-orange-800 flex items-center gap-1">
                            <Clock size={12} />
                            Due Soon
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Customer</p>
                        <p className="font-semibold text-gray-800">{order.customerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Product</p>
                        <p className="font-semibold text-gray-800">{order.product}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Pickup</p>
                        <p className="font-semibold text-gray-800">
                          {order.pickupDate} @ {order.pickupTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button className="ml-4 text-gray-600 hover:text-gray-800">
                    {isExpanded ? '▼' : '▶'}
                  </button>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-6 bg-white space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Customer Contact</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone size={16} className="text-gray-400" />
                              <p className="font-medium text-gray-800">{order.customerPhone}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600">Outlet</p>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin size={16} className="text-gray-400" />
                              <p className="font-medium text-gray-800">{order.pickupOutlet}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Order Details</p>
                            <p className="font-medium text-gray-800 mt-1">
                              Qty: {order.quantity} | Ordered: {order.orderDate}
                            </p>
                          </div>

                          {order.notes && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-sm text-gray-600">Special Notes</p>
                              <p className="font-medium text-gray-800 text-sm mt-1">{order.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 flex gap-3">
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition">
                        ✓ Mark as Completed
                      </button>
                      <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition">
                        📝 Add Note
                      </button>
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

export default CustomerOrders;
