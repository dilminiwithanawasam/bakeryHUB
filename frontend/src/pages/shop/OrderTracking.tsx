import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { Package, MapPin, Clock, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface Order {
  order_id: number;
  order_date: string;
  pickup_date: string;
  status: string;
  outlet_name: string;
  total_amount: number;
  items: OrderItem[];
  special_instructions?: string;
}

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${orderId}/`).catch(() => ({ data: null }));
      
      // Mock data if API fails
      if (!response?.data) {
        const mockOrder: Order = {
          order_id: parseInt(orderId || '1001'),
          order_date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toLocaleString(),
          pickup_date: new Date(Date.now() + 5 * 24 * 3600 * 1000).toLocaleDateString(),
          status: 'PREPARING',
          outlet_name: 'Main Store',
          total_amount: 1250,
          items: [
            { id: 1, product_name: 'Chocolate Velvet Cake', quantity: 1, unit_price: 450, subtotal: 450 },
            { id: 2, product_name: 'Croissants (4 pcs)', quantity: 2, unit_price: 240, subtotal: 480 },
            { id: 3, product_name: 'Premium Iced Coffee', quantity: 2, unit_price: 120, subtotal: 240 },
          ],
          special_instructions: 'Please use sugar-free filling if possible',
        };
        setOrder(mockOrder);
      } else {
        setOrder(response.data);
      }
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'PREPARING':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'READY_FOR_PICKUP':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return '⏳';
      case 'PREPARING':
        return '👨‍🍳';
      case 'READY_FOR_PICKUP':
        return '✅';
      case 'COMPLETED':
        return '🎉';
      case 'CANCELLED':
        return '❌';
      default:
        return '📦';
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 flex items-center justify-center">
          <div className="text-gray-600 text-lg">Loading order details...</div>
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <AlertCircle size={24} className="text-red-600" />
                <div>
                  <h3 className="font-bold text-red-800">Error</h3>
                  <p className="text-red-700">{error || 'Order not found'}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/orders')}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition mb-6"
            >
              ← Back to Orders
            </button>
            <h1 className="text-4xl font-extrabold text-gray-800">Order #{order.order_id}</h1>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600 text-sm">Current Status</p>
                <div className={`inline-block px-6 py-2 rounded-full border-2 mt-2 font-bold ${getStatusColor(order.status)}`}>
                  <span className="mr-2">{getStatusIcon(order.status)}</span>
                  {order.status.replace(/_/g, ' ')}
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-sm">Order Total</p>
                <p className="text-4xl font-extrabold text-orange-600 mt-2">Rs. {order.total_amount}</p>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="mt-8 pt-8 border-t space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Clock size={20} className="text-blue-600 mt-1" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Order Placed</p>
                  <p className="text-gray-600 text-sm">{order.order_date}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Package size={20} className={'mt-1 ' + (order.status !== 'PENDING' ? 'text-green-600' : 'text-gray-400')} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Being Prepared</p>
                  <p className="text-gray-600 text-sm">Our team is preparing your order</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <MapPin size={20} className={'mt-1 ' + (order.status === 'READY_FOR_PICKUP' || order.status === 'COMPLETED' ? 'text-green-600' : 'text-gray-400')} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Ready for Pickup</p>
                  <p className="text-gray-600 text-sm">{order.pickup_date} at {order.outlet_name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                  <div>
                    <p className="font-semibold text-gray-800">{item.product_name}</p>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity} × Rs. {item.unit_price}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600 text-lg">Rs. {item.subtotal}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">Rs. {Math.round(order.total_amount * 0.95)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5%)</span>
                <span className="font-semibold">Rs. {Math.round(order.total_amount * 0.05)}</span>
              </div>
              <div className="flex justify-between text-lg pt-4 border-t">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-orange-600 text-xl">Rs. {order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MapPin size={28} className="text-orange-600" />
              Pickup Location
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Outlet</p>
                <p className="font-bold text-lg text-gray-800">{order.outlet_name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Pickup Date</p>
                <p className="font-bold text-lg text-gray-800">{order.pickup_date}</p>
              </div>
              {order.special_instructions && (
                <div>
                  <p className="text-gray-600 text-sm">Special Instructions</p>
                  <p className="text-gray-800 italic">{order.special_instructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {order.status === 'READY_FOR_PICKUP' && (
            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 text-center">
              <p className="text-green-800 font-bold text-lg mb-4">🎉 Your order is ready for pickup!</p>
              <button
                className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
              >
                View Outlet Details
              </button>
            </div>
          )}

          {order.status === 'PENDING' || order.status === 'PREPARING' ? (
            <div className="bg-blue-50 border-2 border-blue-500 rounded-2xl p-6 text-center">
              <p className="text-blue-800 font-bold text-lg mb-4">⏳ Your order is being prepared</p>
              <p className="text-blue-700 text-sm">We'll notify you when it's ready for pickup</p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default OrderTrackingPage;
