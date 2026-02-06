import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { Search, Star } from 'lucide-react';
import bakeryHero from '../shop/images/bakery-hero.jpeg'; // Correct import

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
  rating: number;
  reviews: number;
  badge?: string;
}

// Example product images
const hardcodedProducts: Product[] = [
  { id: 1, name: 'Creamy Butter Loaf', price: 120, category: 'Bread', description: 'Soft, fluffy whole wheat loaf with premium butter', image: '/images/butter-loaf.jpg', rating: 4.8, reviews: 234, badge: 'Bestseller' },
  { id: 2, name: 'Garlic Pull Apart', price: 150, category: 'Bread', description: 'Delicious garlic and herb infused bread', image: '/images/garlic-pull-apart.jpg', rating: 4.7, reviews: 189 },
  { id: 3, name: 'Sourdough Artisan Loaf', price: 180, category: 'Bread', description: 'Traditional sourdough with tangy flavor', image: '/images/sourdough.jpg', rating: 4.9, reviews: 312, badge: 'New' },
  { id: 101, name: 'Chocolate Velvet Cake', price: 450, category: 'Cake', description: 'Rich dark chocolate cake with ganache', image: '/images/chocolate-cake.jpg', rating: 4.9, reviews: 456, badge: 'Bestseller' },
  { id: 102, name: 'Vanilla Dream Slice', price: 280, category: 'Cake', description: 'Classic vanilla sponge with cream filling', image: '/images/vanilla-slice.jpg', rating: 4.7, reviews: 267 },
  { id: 201, name: 'Croissants (4 pcs)', price: 240, category: 'Pastries', description: 'Buttery, flaky French croissants', image: '/images/croissants.jpg', rating: 4.8, reviews: 421, badge: 'Bestseller' },
  { id: 204, name: 'Macarons Assorted', price: 320, category: 'Pastries', description: 'Colorful French macarons 12 pcs', image: '/images/macarons.jpg', rating: 4.8, reviews: 156 },
  { id: 301, name: 'Premium Iced Coffee', price: 120, category: 'Beverages', description: 'Cold brew coffee with premium beans', image: '/images/iced-coffee.jpg', rating: 4.7, reviews: 289 },
];

const categories = ['All', 'Bread', 'Cake', 'Pastries', 'Beverages'];

const ShopHome = () => {
  const [products, setProducts] = useState<Product[]>(hardcodedProducts);
  const [selected, setSelected] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { addItem, cart } = useCart();

  useEffect(() => {
    api.get('/products/')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data.map((p: any) => ({
            id: p.product_id,
            name: p.product_name,
            price: Number(p.base_price),
            category: p.category,
            description: p.description,
            image: p.image_url || '/images/default.jpg',
            rating: 4.5,
            reviews: Math.floor(Math.random() * 500)
          })));
        }
      })
      .catch(() => console.log('Using hardcoded product data'));
  }, []);

  const filtered = products.filter(p => {
    const matchCategory = selected === 'All' || p.category === selected;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <Header cartCount={cartCount} />

      <div className="min-h-screen bg-orange-50">
        {/* Hero Section */}
        <div className="relative w-full h-96 sm:h-[500px] md:h-[600px]">
          <img
            src={bakeryHero}
            alt="Bakery Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-brown-900">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 drop-shadow-lg">
              Welcome to BakeryHUB
            </h1>
            <p className="text-lg opacity-90 drop-shadow-md">
              Freshly baked goodness delivered to your doorstep
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute top-3 left-3 text-gray-400" size={20} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelected(c)}
                    className={`px-6 py-2 rounded-full font-semibold transition transform ${selected === c
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md scale-105'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-500'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.length > 0 ? filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img src={p.image || '/images/default.jpg'} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  {p.badge && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {p.badge}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-1">{p.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{p.description}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < Math.floor(p.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">({p.reviews})</span>
                  </div>

                  <div className="text-2xl font-extrabold text-orange-600 mb-4">Rs. {p.price}</div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/product/${p.id}`, { state: { product: p } })}
                      className="flex-1 px-3 py-2 border-2 border-orange-500 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        addItem({ id: p.id, name: p.name, price: p.price });
                        alert(`Added ${p.name} to cart!`);
                      }}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No products found. Try adjusting your search.</p>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          {cart.length > 0 && (
            <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">Ready to checkout?</p>
                <p className="text-sm opacity-90">You have {cartCount} items in your cart</p>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="px-8 py-3 bg-white text-orange-600 font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ShopHome;
