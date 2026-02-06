import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api/axios';
import POSReceipt from '../../components/POSReceipt';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  sku?: string;
}

interface CartItem extends Product {
  qty: number;
}

const fallbackProducts: Product[] = [
  { id: 101, name: 'Creamy Butter Loaf', price: 120, category: 'Bread' },
  { id: 102, name: 'Garlic Pull Apart', price: 150, category: 'Bread' },
  { id: 201, name: 'Chocolate Velvet Cake', price: 450, category: 'Cake' },
  { id: 202, name: 'Vanilla Dream Slice', price: 280, category: 'Cake' },
  { id: 301, name: 'Croissants (4 pcs)', price: 240, category: 'Pastries' },
  { id: 401, name: 'Premium Iced Coffee', price: 120, category: 'Beverages' },
];

const POSDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [selectedCategory, setSelectedCategory] = useState('Bread');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [tendered, setTendered] = useState<number | ''>('');
  const [lastReceipt, setLastReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [salesperson, setSalesperson] = useState<string>('Salesperson');
  const [now, setNow] = useState<Date>(() => new Date());

  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category))),
    [products]
  );

  useEffect(() => {
    api.get('/products/')
      .then(res => {
        if (Array.isArray(res.data)) {
          setProducts(res.data.map((p: any) => ({
            id: p.product_id,
            name: p.product_name,
            price: Number(p.base_price),
            category: p.category ?? 'Other',
          })));
        }
      })
      .catch(() => {});
  }, []);

  // Read salesperson name from localStorage if available, fallback to 'Salesperson'
  useEffect(() => {
    const raw = localStorage.getItem('user') || localStorage.getItem('username') || localStorage.getItem('employee') || localStorage.getItem('employee_name');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSalesperson(parsed?.username || parsed?.name || parsed?.full_name || String(parsed));
      } catch {
        setSalesperson(raw);
      }
    }
  }, []);

  // Live clock for header
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    return products
      .filter(p => p.category === selectedCategory)
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, selectedCategory, search]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const found = prev.find(p => p.id === product.id);
      return found
        ? prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p)
        : [...prev, { ...product, qty: 1 }];
    });
  };

  const changeQty = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(p => p.id === id ? { ...p, qty: p.qty + delta } : p)
        .filter(p => p.qty > 0)
    );
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal - Math.min(subtotal, discount);
  const change = typeof tendered === 'number' ? Math.max(0, tendered - total) : 0;

  const completeSale = async () => {
    if (!cart.length) return alert('Add items first');
    setLoading(true);
    const receipt = { sale_id: Date.now(), cart, subtotal, total, tendered, change };
    setLastReceipt(receipt);
    setCart([]);
    setDiscount(0);
    setTendered('');
    setLoading(false);
  };

  return (
    <div className="w-full h-screen bg-white text-black flex flex-col">

      {/* HEADER */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        <h1 className="text-xl font-bold">BakeryHUB POS</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-semibold text-black">{salesperson}</div>
            <div className="text-xs text-gray-700">{now.toLocaleString()}</div>
          </div>
          <button
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="bg-red-600 text-white px-4 py-2 font-bold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — PRODUCTS */}
        <div className="w-3/4 border-r flex flex-col">

          {/* FILTERS */}
          <div className="p-2 border-b">
            <div className="flex gap-2 mb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 font-bold ${
                    selectedCategory === cat ? 'bg-black text-white' : 'bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search product..."
              className="w-full border-2 px-3 py-2 text-lg font-semibold"
            />
          </div>

          {/* PRODUCT GRID */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="grid grid-cols-4 xl:grid-cols-5 gap-2">
              {filtered.map(p => {
                const qty = cart.find(i => i.id === p.id)?.qty ?? 0;
                return (
                  <div key={p.id} className="border p-3 flex flex-col justify-between min-h-[160px]">
                    <div className="font-bold text-base">{p.name}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-extrabold">Rs. {p.price}</span>
                      <button
                        onClick={() => addToCart(p)}
                        className="bg-black text-white px-5 py-2 font-bold text-lg"
                      >
                        {qty ? `+${qty}` : 'Add'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — BILLING */}
        <div className="w-1/4 bg-gray-50 flex flex-col p-2">

          <h2 className="font-bold text-lg mb-2">Billing</h2>

          <div className="flex-1 overflow-y-auto">
            {cart.map(i => (
              <div key={i.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <div className="font-bold">{i.name}</div>
                  <div className="text-sm">Rs. {i.price} × {i.qty}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => changeQty(i.id, -1)} className="px-2 bg-gray-200">−</button>
                  <button onClick={() => changeQty(i.id, 1)} className="px-2 bg-gray-200">+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-2 space-y-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>Rs. {total}</span>
            </div>

            <input
              type="number"
              value={tendered as any}
              onChange={e => setTendered(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Amount paid"
              className="w-full border-2 px-3 py-2 font-bold text-lg"
            />

            <div className="flex justify-between font-semibold">
              <span>Change</span>
              <span>Rs. {change}</span>
            </div>

            <button
              onClick={completeSale}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 font-bold text-lg"
            >
              {loading ? 'Processing…' : 'Complete Sale'}
            </button>
          </div>

          {lastReceipt && <POSReceipt data={lastReceipt} />}
        </div>
      </div>
    </div>
  );
};

export default POSDashboard;
