// src/pages/factory/ProductList.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';

// Hardcoded product data based on your form fields
const hardcodedProducts = [
  {
    id: 1,
    product_name: 'Chocolate Brownie',
    description: 'Rich chocolate brownie with walnuts',
    category: 'Brownies',
    base_price: '350.00',
    shelf_life_days: 7,
    measurement_type: 'PCS',
    created_at: '2024-01-15',
    stock_count: 125
  },
  {
    id: 2,
    product_name: 'Vanilla Cake',
    description: 'Classic vanilla sponge cake',
    category: 'Cakes',
    base_price: '1200.00',
    shelf_life_days: 5,
    measurement_type: 'PCS',
    created_at: '2024-01-10',
    stock_count: 42
  },
  {
    id: 3,
    product_name: 'Croissant',
    description: 'Buttery French croissant',
    category: 'Pastries',
    base_price: '250.00',
    shelf_life_days: 3,
    measurement_type: 'PCS',
    created_at: '2024-01-12',
    stock_count: 89
  },
  {
    id: 4,
    product_name: 'Whole Wheat Bread',
    description: 'Healthy whole wheat bread loaf',
    category: 'Breads',
    base_price: '450.00',
    shelf_life_days: 4,
    measurement_type: 'BOX',
    created_at: '2024-01-14',
    stock_count: 56
  },
  {
    id: 5,
    product_name: 'Blueberry Muffin',
    description: 'Fresh blueberry muffin with streusel topping',
    category: 'Muffins',
    base_price: '280.00',
    shelf_life_days: 4,
    measurement_type: 'PCS',
    created_at: '2024-01-13',
    stock_count: 167
  },
  {
    id: 6,
    product_name: 'Chocolate Chip Cookies',
    description: 'Crispy cookies with chocolate chips',
    category: 'Cookies',
    base_price: '50.00',
    shelf_life_days: 14,
    measurement_type: 'PCS',
    created_at: '2024-01-08',
    stock_count: 320
  }
];

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(hardcodedProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Action handlers
  const handleView = (id: number) => {
    alert(`Viewing product ${id}`);
    // In real app: navigate(`/factory/products/${id}`);
  };

  const handleEdit = (id: number) => {
    alert(`Editing product ${id}`);
    // In real app: navigate(`/factory/products/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      alert('Product deleted successfully!');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Product Inventory 📦
            </h1>
            <p className="text-gray-500 mt-1">
              Manage all bakery products and their details
            </p>
          </div>
          <button
            onClick={() => navigate('/factory/AddProduct')}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100">
            <div className="text-sm text-gray-500 font-semibold">Total Products</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">{products.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100">
            <div className="text-sm text-gray-500 font-semibold">Categories</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">{categories.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100">
            <div className="text-sm text-gray-500 font-semibold">Total Stock</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">
              {products.reduce((sum, p) => sum + p.stock_count, 0)}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100">
            <div className="text-sm text-gray-500 font-semibold">Avg Price</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">
              LKR {Math.round(products.reduce((sum, p) => sum + parseFloat(p.base_price), 0) / products.length)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('');
                }}
                className="w-full p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-orange-50 to-amber-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Shelf Life
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-orange-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-gray-800">{product.product_name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">LKR {product.base_price}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="font-medium">{product.shelf_life_days} days</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-bold ${product.stock_count < 50 ? 'text-red-600' : 'text-green-600'}`}>
                        {product.stock_count} {product.measurement_type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                        {product.measurement_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(product.id)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                          title="Edit Product"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Delete Product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterCategory 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first product'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductList;