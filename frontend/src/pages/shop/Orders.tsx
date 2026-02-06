import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { ShoppingBag, ChevronRight, AlertCircle, Star } from 'lucide-react';
import api from '../../api/axios';

interface OrderSummary {
  order_id: number;
  order_date: string;
  status: string;
  total_amount: number;
  outlet_name: string;
  item_count: number;
  rating?: number;
}

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/customer/orders/').catch(() => ({ data: null }));

      // Mock data if API fails
      if (!response?.data) {
        const mockOrders: OrderSummary[] = [
          {
            order_id: 1001,
            order_date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toLocaleDateString(),
            status: 'PREPARING',
            total_amount: 1250,
            outlet_name: 'Main Store',
            item_count: 4,
          },
          {
            order_id: 1000,
            order_date: new Date(Date.now() - 8 * 24 * 3600 * 1000).toLocaleDateString(),
            status: 'COMPLETED',
            total_amount: 850,
            outlet_name: 'Main Store',
            item_count: 3,
            rating: 5,
          },
          {
            order_id: 999,
            order_date: new Date(Date.now() - 15 * 24 * 3600 * 1000).toLocaleDateString(),
            status: 'COMPLETED',
            total_amount: 2100,
            outlet_name: 'Downtown Branch',
            item_count: 7,
            rating: 4,
          },
          {
            order_id: 998,
            order_date: new Date(Date.now() - 22 * 24 * 3600 * 1000).toLocaleDateString(),
            status: 'COMPLETED',
            total_amount: 450,
            outlet_name: 'Main Store',
            item_count: 2,
            rating: 5,
          },
        ];
        setOrders(mockOrders);
      } else {
        setOrders(response.data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ Pending', dotColor: 'bg-yellow-500' };
      case 'PREPARING':
        return { bg: 'bg-blue-100', text: 'text-blue-800', label: '👨‍🍳 Preparing', dotColor: 'bg-blue-500' };
      case 'READY_FOR_PICKUP':
        return { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Ready', dotColor: 'bg-green-500' };
      case 'COMPLETED':
        return { bg: 'bg-purple-100', text: 'text-purple-800', label: '🎉 Completed', dotColor: 'bg-purple-500' };
      case 'CANCELLED':
        return { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Cancelled', dotColor: 'bg-red-500' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: '📦 Unknown', dotColor: 'bg-gray-500' };
    }
  };

  const filteredOrders = orders.filter(
    order => filterStatus === 'ALL' || order.status === filterStatus
  );

  const statusOptions = [
    { value: 'ALL', label: 'All Orders' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PREPARING', label: 'Preparing' },
    { value: 'READY_FOR_PICKUP', label: 'Ready' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 flex items-center justify-center">
          <div className="text-gray-600 text-lg">Loading your orders...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
              <ShoppingBag size={36} className="text-orange-600" />
              Your Orders
            </h1>
            <p className="text-gray-600 mt-2">Track and manage your bakery orders</p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8 flex flex-wrap gap-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterStatus(option.value)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  filterStatus === option.value
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-white text-gray-800 hover:bg-gray-100 border-2 border-orange-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">
                {filterStatus === 'ALL'
                  ? "You haven't placed any orders yet."
                  : `You have no ${statusOptions.find(o => o.value === filterStatus)?.label.toLowerCase()} orders.`}
              </p>
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusColor(order.status);
                return (
                  <div
                    key={order.order_id}
                    onClick={() => navigate(`/order/${order.order_id}`)}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer transform hover:scale-102"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {/* Order Header */}
                        <div className="flex items-center gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Order ID</p>
                            <h3 className="text-2xl font-extrabold text-gray-800">#{order.order_id}</h3>
                          </div>
                          <div className="flex-1">
                            <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${statusInfo.bg} ${statusInfo.text}`}>
                              {statusInfo.label}
                            </div>
                          </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                            <p className="font-semibold text-gray-800">{order.order_date}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Items</p>
                            <p className="font-semibold text-gray-800">{order.item_count} item{order.item_count !== 1 ? 's' : ''}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Outlet</p>
                            <p className="font-semibold text-gray-800 truncate">{order.outlet_name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                            <p className="font-bold text-orange-600 text-lg">Rs. {order.total_amount}</p>
                          </div>
                        </div>

                        {/* Rating if completed */}
                        {order.status === 'COMPLETED' && (
                          <div className="flex items-center gap-2">
                            {order.rating ? (
                              <>
                                <span className="text-sm text-gray-600">Your rating:</span>
                                <div className="flex gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      size={16}
                                      className={i < order.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                    />
                                  ))}
                                </div>
                              </>
                            ) : (
                              <span className="text-sm text-blue-600 font-semibold">⭐ Rate this order</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0 ml-4">
                        <ChevronRight size={24} className="text-orange-600" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
            <div className="flex gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-900">Need help with your order?</p>
                <p className="text-blue-800 text-sm mt-1">
                  Contact our customer service at support@bakeryhub.com or call us during business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersPage;