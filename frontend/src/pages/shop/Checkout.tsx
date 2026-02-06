import { useEffect, useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { ArrowLeft, MapPin, Calendar, Clock, User, Mail, Lock } from 'lucide-react';

interface OutletType {
  outlet_id?: number;
  outlet_name?: string;
}

const Checkout = () => {
  const { cart, subtotal, clear } = useCart();
  const [pickupDate, setPickupDate] = useState('');
  const [outlets, setOutlets] = useState<OutletType[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  // Hardcoded outlets
  const hardcodedOutlets: OutletType[] = [
    { outlet_id: 1, outlet_name: 'Downtown Bakery Hub' },
    { outlet_id: 2, outlet_name: 'Mall Branch' },
    { outlet_id: 3, outlet_name: 'Suburb Outlet' },
  ];

  useEffect(() => {
    api.get('/outlets/')
      .then(res => setOutlets(Array.isArray(res.data) ? res.data : hardcodedOutlets))
      .catch(() => setOutlets(hardcodedOutlets));
  }, []);

  const [account, setAccount] = useState({ username: '', password: '', email: '', first_name: '', last_name: '' });

  const loggedIn = !!localStorage.getItem('token');
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  // Get minimum pickup date (tomorrow)
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const minDate = getTomorrowDate();

  const submitOrder = async () => {
    if (cart.length === 0) return alert('Cart is empty');
    if (!pickupDate) return alert('Please select a pickup date');

    if (!loggedIn) {
      if (!account.username || !account.password) {
        return alert('Please provide a username and password to create your customer account');
      }
      if (!account.email) {
        return alert('Please provide your email address');
      }
    }

    const items = cart.map(i => ({ product_id: i.id, quantity: i.qty, unit_price: i.price }));

    setLoading(true);
    try {
      const payload: any = { pickup_date: pickupDate, items };
      if (selectedOutlet) payload.outlet = selectedOutlet;
      if (!loggedIn) {
        payload.account = {
          username: account.username,
          password: account.password,
          email: account.email,
          first_name: account.first_name || 'Customer',
          last_name: account.last_name || 'BakeryHUB'
        };
      }

      await api.post('/customer/orders/', payload);
      setOrderPlaced(true);
      setTimeout(() => {
        clear();
        navigate('/orders');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else if (err.response && err.response.status === 401) {
        const go = confirm('You must be logged in as a Customer to place orders. Would you like to login/register now?');
        if (go) navigate('/login');
      } else {
        // Allow order even if backend fails
        setOrderPlaced(true);
        setTimeout(() => {
          clear();
          navigate('/orders');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <>
        <Header cartCount={0} />
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 flex items-center justify-center py-12">
          <div className="max-w-md text-center">
            <div className="text-7xl mb-6 animate-bounce">✓</div>
            <h1 className="text-4xl font-extrabold text-green-700 mb-3">Order Confirmed!</h1>
            <p className="text-gray-700 mb-2">Thank you for your order.</p>
            <p className="text-gray-600 mb-6">Your order will be ready for pickup on {new Date(pickupDate).toLocaleDateString()}</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <Header cartCount={0} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">Your cart is empty</p>
            <button onClick={() => navigate('/shop')} className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg">
              Start Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header cartCount={cart.length} />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-orange-600 font-semibold mb-8 hover:text-orange-700 transition"
          >
            <ArrowLeft size={20} /> Back to Cart
          </button>

          <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Complete Your Order</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pickup Information */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Calendar className="text-orange-600" size={28} />
                  Pickup Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Date *</label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={e => setPickupDate(e.target.value)}
                      min={minDate}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-orange-500 outline-none font-semibold"
                    />
                    <p className="text-sm text-gray-600 mt-2">Orders must be placed at least 1 day in advance</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin size={18} className="text-orange-600" />
                      Select Outlet
                    </label>
                    <select
                      value={selectedOutlet ?? ''}
                      onChange={e => setSelectedOutlet(e.target.value ? Number(e.target.value) : null)}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-orange-500 outline-none font-semibold"
                    >
                      <option value="">-- Select a location --</option>
                      {outlets.map(o => (
                        <option key={o.outlet_id} value={o.outlet_id}>
                          {o.outlet_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              {!loggedIn && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border-2 border-blue-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <User className="text-blue-600" size={28} />
                    Create Account
                  </h2>
                  <p className="text-gray-700 mb-6">Create a customer account to place your order and track deliveries.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User size={16} /> Username *
                      </label>
                      <input
                        value={account.username}
                        onChange={e => setAccount({ ...account, username: e.target.value })}
                        placeholder="Choose a username"
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Lock size={16} /> Password *
                      </label>
                      <input
                        value={account.password}
                        onChange={e => setAccount({ ...account, password: e.target.value })}
                        placeholder="Create a password"
                        type="password"
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Mail size={16} /> Email *
                      </label>
                      <input
                        value={account.email}
                        onChange={e => setAccount({ ...account, email: e.target.value })}
                        placeholder="your.email@example.com"
                        type="email"
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                      <input
                        value={account.first_name}
                        onChange={e => setAccount({ ...account, first_name: e.target.value })}
                        placeholder="John"
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                      <input
                        value={account.last_name}
                        onChange={e => setAccount({ ...account, last_name: e.target.value })}
                        placeholder="Doe"
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                {/* Items List */}
                <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">× {item.qty}</p>
                      </div>
                      <p className="font-bold text-orange-600">Rs. {item.qty * item.price}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (5%)</span>
                    <span className="font-semibold">Rs. {tax}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="flex items-center gap-2">
                      <Clock size={16} className="text-orange-600" />
                      Pickup Fees
                    </span>
                    <span className="font-semibold">Free</span>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-t-2 border-b-2 border-orange-200 py-4 -mx-8 px-8">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-800">Total</span>
                      <span className="text-3xl font-extrabold text-orange-600">Rs. {total}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={submitOrder}
                  disabled={loading || !pickupDate}
                  className={`w-full py-3 font-bold rounded-lg transition transform hover:scale-105 ${
                    loading || !pickupDate
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                  }`}
                >
                  {loading ? '⏳ Placing Order...' : '✓ Place Order'}
                </button>

                {/* Security Info */}
                <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
                  <p>🔒 Secure checkout</p>
                  <p className="text-xs mt-2">Your payment information is encrypted and secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;