import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../contexts/CartContext';
import Header from '../../components/Header';
import { ChevronLeft, Star, Clock, TrendingUp } from 'lucide-react';

interface ProductDetailType {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  emoji: string;
  rating: number;
  reviews: number;
  details?: string;
  ingredients?: string[];
  servings?: string;
  badge?: string;
}

const ProductDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addItem, cart } = useCart();
  const params = useParams();

  const initialProduct = state?.product;
  const [localProduct, setLocalProduct] = useState<ProductDetailType | null>(initialProduct ?? null);
  const [qty, setQty] = useState<number>(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const productDetails: { [key: number]: Partial<ProductDetailType> } = {
    1: {
      details: 'Our signature creamy butter loaf is made with fresh, premium quality butter and the finest wheat flour. Baked fresh daily.',
      ingredients: ['Wheat flour', 'Premium butter', 'Milk', 'Yeast', 'Salt'],
      servings: '6-8 slices'
    },
    2: { details: 'Savory garlic and herb bread perfect for breakfast or as a side.', ingredients: ['Flour', 'Garlic', 'Herbs', 'Butter'], servings: '4-6 servings' },
    101: { details: 'Indulge in our rich, moist chocolate cake layered with silky chocolate ganache.', ingredients: ['Cocoa powder', 'Dark chocolate', 'Eggs', 'Flour', 'Butter'], servings: '8-10 slices' },
    102: { details: 'Classic vanilla sponge cake with creamy vanilla filling and light frosting.', ingredients: ['Eggs', 'Flour', 'Vanilla extract', 'Butter', 'Sugar'], servings: '6-8 slices' },
    201: { details: 'Four buttery, flaky croissants that melt in your mouth. Perfect for breakfast!', ingredients: ['Flour', 'Butter', 'Milk', 'Yeast'], servings: '4 croissants' },
    301: { details: 'Cold brew coffee made from premium quality beans, smooth and refreshing.', ingredients: ['Premium coffee beans', 'Cold water'], servings: '1 tall glass' },
  };

  useEffect(() => {
    if (!localProduct && params.id) {
      api.get(`/products/${params.id}/`)
        .then(res => {
          setLocalProduct({
            id: res.data.product_id,
            name: res.data.product_name,
            price: Number(res.data.base_price),
            category: res.data.category,
            description: res.data.description,
            emoji: '🍰',
            rating: 4.5,
            reviews: 234,
            ...productDetails[res.data.product_id]
          });
        })
        .catch(() => {
          console.log('Could not fetch product details');
        });
    } else if (localProduct) {
      setLocalProduct({
        ...localProduct,
        ...productDetails[localProduct.id]
      });
    }
  }, [params.id]);

  if (!localProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button onClick={() => navigate('/shop')} className="flex items-center gap-2 text-orange-600 font-semibold mb-6">
            <ChevronLeft size={20} /> Back to Shop
          </button>
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({ id: localProduct.id, name: localProduct.name, price: localProduct.price }, qty);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <Header cartCount={cartCount} />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 text-orange-600 font-semibold mb-8 hover:text-orange-700 transition"
          >
            <ChevronLeft size={20} /> Back to Shop
          </button>

          {/* Product Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Product Image Side */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center p-8 relative">
              <div className="text-9xl">{localProduct.emoji}</div>
              {localProduct.badge && (
                <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                  {localProduct.badge}
                </div>
              )}
            </div>

            {/* Product Info Side */}
            <div className="p-8 flex flex-col justify-between">
              {/* Header Info */}
              <div>
                <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  {localProduct.category}
                </span>

                <h1 className="text-4xl font-extrabold text-gray-800 mb-3">{localProduct.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < Math.floor(localProduct.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 font-semibold">{localProduct.rating}</span>
                  <span className="text-gray-500 text-sm">({localProduct.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="text-5xl font-extrabold text-orange-600 mb-6">Rs. {localProduct.price}</div>

                {/* Description */}
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">{localProduct.description}</p>

                {localProduct.details && (
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded mb-6">
                    <p className="text-gray-700">{localProduct.details}</p>
                  </div>
                )}

                {/* Ingredients */}
                {localProduct.ingredients && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <TrendingUp size={20} className="text-orange-600" />
                      Key Ingredients
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {localProduct.ingredients.map((ing, idx) => (
                        <div key={idx} className="bg-yellow-50 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700">
                          ✓ {ing}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-8 flex items-center gap-4">
                  <Clock className="text-orange-600" size={24} />
                  <div>
                    <div className="font-semibold text-gray-800">Fresh Baked Daily</div>
                    <p className="text-sm text-gray-600">Estimated delivery within 2-4 hours</p>
                  </div>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div>
                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
                  <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-2 w-fit">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-4 py-2 font-bold text-gray-700 hover:bg-gray-200 rounded transition"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={qty}
                      onChange={e => setQty(Math.max(1, Number(e.target.value || 1)))}
                      className="w-16 text-center border border-gray-300 rounded px-2 py-2 font-bold text-lg"
                      min={1}
                    />
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="px-4 py-2 font-bold text-gray-700 hover:bg-gray-200 rounded transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-lg hover:shadow-lg transition transform hover:scale-105"
                  >
                    🛒 Add to Cart ({qty})
                  </button>
                  <button
                    onClick={() => navigate('/cart')}
                    className="px-6 py-4 border-2 border-orange-500 text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition"
                  >
                    View Cart
                  </button>
                </div>

                {/* Success Message */}
                {showSuccess && (
                  <div className="mt-4 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg font-semibold animate-pulse">
                    ✓ Added to cart successfully!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Customer Reviews</h2>
            <div className="space-y-4">
              {[
                { name: 'Sarah M.', rating: 5, comment: 'Absolutely delicious! Fresh and tasty.' },
                { name: 'Ahmed K.', rating: 5, comment: 'Best bakery in town. Highly recommended!' },
                { name: 'Priya P.', rating: 4, comment: 'Great quality, quick delivery.' },
              ].map((review, idx) => (
                <div key={idx} className="pb-4 border-b last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">{review.name}</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;