import React from 'react';
import { Plus, Edit, Trash2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FactoryManagerLayout from '../../components/FactoryManagerLayout';

interface Product {
  id: string;
  name: string;
  category: string;
  preparationTime: number;
  batchSize: number;
  popularity: 'High' | 'Medium' | 'Low';
  currentStock: number;
}

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [products] = React.useState<Product[]>([
    {
      id: 'PROD-001',
      name: 'Croissants',
      category: 'Pastries',
      preparationTime: 45,
      batchSize: 50,
      popularity: 'High',
      currentStock: 145,
    },
    {
      id: 'PROD-002',
      name: 'Sourdough Bread',
      category: 'Bread',
      preparationTime: 480,
      batchSize: 30,
      popularity: 'High',
      currentStock: 28,
    },
    {
      id: 'PROD-003',
      name: 'Chocolate Cake',
      category: 'Cakes',
      preparationTime: 90,
      batchSize: 8,
      popularity: 'Medium',
      currentStock: 12,
    },
    {
      id: 'PROD-004',
      name: 'Donuts',
      category: 'Pastries',
      preparationTime: 60,
      batchSize: 100,
      popularity: 'High',
      currentStock: 245,
    },
    {
      id: 'PROD-005',
      name: 'Bagels',
      category: 'Bread',
      preparationTime: 120,
      batchSize: 75,
      popularity: 'Medium',
      currentStock: 155,
    },
    {
      id: 'PROD-006',
      name: 'Wedding Cake',
      category: 'Specialty',
      preparationTime: 240,
      batchSize: 1,
      popularity: 'Low',
      currentStock: 2,
    },
  ]);

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case 'High':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = ['All', 'Pastries', 'Bread', 'Cakes', 'Specialty'];

  return (
    <FactoryManagerLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Product Catalog</h1>
            <p className="text-gray-600 mt-1">Manage production products and specifications</p>
          </div>
          <button 
            onClick={() => navigate('/factory/AddProduct')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition">
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                cat === 'All'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-sm text-orange-100">{product.category}</p>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Prep Time</p>
                    <p className="text-lg font-bold text-gray-800">{product.preparationTime} min</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Batch Size</p>
                    <p className="text-lg font-bold text-gray-800">{product.batchSize} units</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="text-xs text-gray-600">Current Stock</p>
                    <p className="text-lg font-bold text-blue-600">{product.currentStock}</p>
                  </div>
                  <Zap className="text-blue-600" size={24} />
                </div>

                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getPopularityColor(product.popularity)}`}>
                    {product.popularity} Demand
                  </span>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition">
                    <Edit size={16} />
                    Edit
                  </button>
                  <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FactoryManagerLayout>
  );
};

export default Products;
