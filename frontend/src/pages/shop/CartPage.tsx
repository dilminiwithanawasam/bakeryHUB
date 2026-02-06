import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const { cart, changeQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  return (
    <>
      <Header cartCount={cart.length} />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition mb-6"
            >
              <ArrowLeft size={20} /> Continue Shopping
            </button>
            <h1 className="text-4xl font-extrabold text-gray-800">🛒 Your Cart</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cart.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</p>
                  <p className="text-gray-600 mb-6">Looks like you haven't added any items yet.</p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:shadow-lg transition"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-6 flex-1">
                        <div className="text-5xl">🍰</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                          <p className="text-orange-600 font-semibold text-lg">Rs. {item.price}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                          <button
                            onClick={() => changeQty(item.id, Math.max(1, item.qty - 1))}
                            className="p-1 text-gray-700 hover:bg-gray-200 rounded transition"
                          >
                            <Minus size={18} />
                          </button>
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => changeQty(item.id, Number(e.target.value) - item.qty)}
                            className="w-14 text-center font-bold border-0 bg-transparent"
                            min={1}
                          />
                          <button
                            onClick={() => changeQty(item.id, 1)}
                            className="p-1 text-gray-700 hover:bg-gray-200 rounded transition"
                          >
                            <Plus size={18} />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right w-32">
                          <div className="text-sm text-gray-600 mb-1">Subtotal</div>
                          <div className="text-2xl font-extrabold text-orange-600">Rs. {item.qty * item.price}</div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {cart.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">Rs. {subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (5%)</span>
                      <span className="font-semibold">Rs. {tax}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Items</span>
                      <span className="font-semibold">{cart.length}</span>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-t-2 border-b-2 border-orange-200 py-4 -mx-6 px-6">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-800">Total</span>
                        <span className="text-3xl font-extrabold text-orange-600">Rs. {total}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/checkout')}
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105"
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={() => navigate('/shop')}
                      className="w-full py-3 border-2 border-orange-500 text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition"
                    >
                      Continue Shopping
                    </button>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
                    <p>🔒 Your payment is secure</p>
                    <p className="text-xs mt-2">All transactions are encrypted and protected</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage;