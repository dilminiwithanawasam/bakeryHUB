import { useState } from "react";
import { useNavigate } from "react-router-dom";

const products = [
  { id: 1, name: "Butter Bread", price: 120, category: "Breads" },
  { id: 2, name: "Chicken Bun", price: 150, category: "Pastries" },
  { id: 3, name: "Fish Bun", price: 140, category: "Pastries" },
  { id: 4, name: "Chocolate Cake Slice", price: 280, category: "Pastries" },
  { id: 5, name: "Cream Donut", price: 130, category: "Pastries" },
  { id: 6, name: "Tea", price: 80, category: "Drinks" },
  { id: 7, name: "Coffee", price: 150, category: "Drinks" },
];

const categories = ["Breads", "Pastries", "Drinks"];

const POSDashboard = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Breads");
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-700">
          🥐 BakeryHUB POS
        </h1>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="text-red-600 font-semibold hover:underline"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Products Section */}
        <div className="col-span-8">
          {/* Categories */}
          <div className="flex gap-4 mb-5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-white text-orange-600 border hover:bg-orange-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-3 gap-5">
            {products
              .filter((p) => p.category === selectedCategory)
              .map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-2xl p-4 cursor-pointer border hover:border-orange-400 shadow-sm hover:shadow-lg transition"
                >
                  <div className="h-24 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 mb-3 flex items-center justify-center text-3xl">
                    🍰
                  </div>
                  <h3 className="font-bold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-orange-600 font-extrabold text-lg">
                    Rs. {product.price}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="col-span-4 bg-white rounded-2xl shadow-xl p-5 border-t-4 border-orange-500">
          <h2 className="text-xl font-extrabold mb-4 text-orange-700">
            🧾 Order Summary
          </h2>

          {cart.length === 0 && (
            <p className="text-gray-400 text-sm">
              No items added yet
            </p>
          )}

          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-3"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.qty} × Rs. {item.price}
                </p>
              </div>
              <p className="font-bold text-orange-600">
                Rs. {item.qty * item.price}
              </p>
            </div>
          ))}

          <hr className="my-4" />

          <div className="flex justify-between font-extrabold text-lg">
            <span>Total</span>
            <span className="text-orange-700">
              Rs. {total}
            </span>
          </div>

          <button className="w-full mt-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-bold shadow-lg transition">
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default POSDashboard;
