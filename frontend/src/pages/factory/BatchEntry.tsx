import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

interface Product {
  product_id: number;
  product_name: string;
  shelf_life_days: number;
  category: string; // Added category field
}

const BatchEntry = () => {
  const navigate = useNavigate();

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const calculateExpiry = (startDate: string, days: number): string => {
    if (!startDate || !days) return '';
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  // Hardcoded categories
  const hardcodedCategories = [
    'Cakes',
    'Brownies',
    'Pastries',
    'Breads',
    'Cookies',
    'Muffins',
    'Desserts',
    'Savory',
    'Seasonal',
    'Special'
  ];

  const [productList, setProductList] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [formData, setFormData] = useState({
    product_id: '',
    batch_code: '',
    quantity: '',
    mfd: getTodayDate(),
    exp: ''
  });

  useEffect(() => {
    // Hardcoded product data instead of API call
    const hardcodedProducts: Product[] = [
      { product_id: 1, product_name: 'Chocolate Brownie', shelf_life_days: 7, category: 'Brownies' },
      { product_id: 2, product_name: 'Vanilla Cake', shelf_life_days: 5, category: 'Cakes' },
      { product_id: 3, product_name: 'Red Velvet Cake', shelf_life_days: 5, category: 'Cakes' },
      { product_id: 4, product_name: 'Croissant', shelf_life_days: 3, category: 'Pastries' },
      { product_id: 5, product_name: 'Whole Wheat Bread', shelf_life_days: 4, category: 'Breads' },
      { product_id: 6, product_name: 'Blueberry Muffin', shelf_life_days: 4, category: 'Muffins' },
      { product_id: 7, product_name: 'Chocolate Chip Cookies', shelf_life_days: 14, category: 'Cookies' },
      { product_id: 8, product_name: 'Cinnamon Roll', shelf_life_days: 3, category: 'Pastries' },
      { product_id: 9, product_name: 'Baguette', shelf_life_days: 2, category: 'Breads' },
      { product_id: 10, product_name: 'Carrot Cake', shelf_life_days: 6, category: 'Cakes' },
    ];
    
    setProductList(hardcodedProducts);
    setFilteredProducts(hardcodedProducts); // Initially show all products
  }, []);

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory) {
      const filtered = productList.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredProducts(filtered);
      
      // Reset product selection if selected product is not in filtered list
      if (formData.product_id && !filtered.some(p => p.product_id === parseInt(formData.product_id))) {
        setFormData(prev => ({ ...prev, product_id: '', exp: '' }));
      }
    } else {
      setFilteredProducts(productList);
    }
  }, [selectedCategory, productList]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProductId = e.target.value;
    const selectedProduct = productList.find(
      p => p.product_id === parseInt(newProductId)
    );

    setFormData(prev => ({
      ...prev,
      product_id: newProductId,
      exp: selectedProduct
        ? calculateExpiry(prev.mfd, selectedProduct.shelf_life_days)
        : prev.exp
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMfd = e.target.value;
    const currentProduct = productList.find(
      p => p.product_id === parseInt(formData.product_id)
    );

    setFormData(prev => ({
      ...prev,
      mfd: newMfd,
      exp: currentProduct
        ? calculateExpiry(newMfd, currentProduct.shelf_life_days)
        : prev.exp
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/factory/create-batch/', {
        product_id: parseInt(formData.product_id),
        batch_code: formData.batch_code,
        quantity: parseInt(formData.quantity),
        mfd: formData.mfd,
        exp: formData.exp
      });

      alert('✅ Batch Added Successfully!');
      setFormData({
        product_id: '',
        batch_code: '',
        quantity: '',
        mfd: getTodayDate(),
        exp: ''
      });
    } catch (error: any) {
      alert(`❌ ${error.response?.data?.error || 'Failed to add batch'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Sidebar />

      <main className="flex-1 ml-64 p-12">

        {/* Tabs */}
        <div className="flex max-w-3xl mb-10 rounded-xl overflow-hidden shadow-md">
          <div className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 font-semibold text-center">
            Batch Entry
          </div>
          <div
            onClick={() => navigate('/factory/AddProduct')}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 font-semibold text-center cursor-pointer transition"
          >
            Product
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center max-w-5xl mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Add Production Batch 🏭
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/factory/BatchList')}
             className="text-orange-600 font-semibold transition-colors hover:text-orange-800 active:text-red-600 cursor-pointer"

            >
              View Batch List
            </button>
            
          </div>
        </div>

        {/* Card */}
        <div className="max-w-5xl bg-white rounded-3xl shadow-2xl border border-orange-200">
          <div className="border-b p-8">
            <p className="text-gray-500 text-sm">
              Enter batch details. Expiry date is calculated automatically.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">

            {/* Category Filter */}
            <Field label="Filter by Category">
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="input flex-1"
                >
                  <option value="">All Categories</option>
                  {hardcodedCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition whitespace-nowrap"
                >
                  Clear Filter
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Filter products by category to find products faster
              </p>
            </Field>

            {/* Product Selection */}
            <Field label="Product">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">
                    Available Products: {filteredProducts.length}
                  </span>
                  {selectedCategory && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                      Filtered by: {selectedCategory}
                    </span>
                  )}
                </div>
                <select
                  value={formData.product_id}
                  onChange={handleProductChange}
                  className="input"
                  required
                  disabled={filteredProducts.length === 0}
                >
                  <option value="">{filteredProducts.length === 0 ? 'No products in this category' : 'Select product'}</option>
                  {filteredProducts.map(p => (
                    <option key={p.product_id} value={p.product_id}>
                      {p.product_name} ({p.category}) - Shelf life: {p.shelf_life_days} days
                    </option>
                  ))}
                </select>
                {filteredProducts.length === 0 && (
                  <p className="text-sm text-orange-600">
                    No products found in this category. Try selecting a different category.
                  </p>
                )}
              </div>
            </Field>

            <Field label="Batch Code">
              <input
                name="batch_code"
                value={formData.batch_code}
                onChange={handleChange}
                className="input"
                placeholder="B-001"
                required
              />
            </Field>

            <Field label="Quantity Produced">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="input"
                placeholder="50"
                required
              />
            </Field>

            <Field label="Manufactured Date">
              <input
                type="date"
                value={formData.mfd}
                onChange={handleDateChange}
                className="input"
                required
              />
            </Field>

            <Field label="Expiry Date">
              <div className="space-y-2">
                <input
                  type="date"
                  name="exp"
                  value={formData.exp}
                  onChange={handleChange}
                  className="input bg-orange-50"
                  required
                  readOnly
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-orange-600">
                    ⓘ Auto-calculated from shelf life
                  </span>
                  {formData.product_id && (
                    <span className="text-xs text-gray-600">
                      Based on {productList.find(p => p.product_id === parseInt(formData.product_id))?.shelf_life_days || 0} days shelf life
                    </span>
                  )}
                </div>
              </div>
            </Field>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="submit"
                disabled={loading || !formData.product_id}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving…' : 'Add Batch'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({
                    product_id: '',
                    batch_code: '',
                    quantity: '',
                    mfd: getTodayDate(),
                    exp: ''
                  });
                  setSelectedCategory('');
                }}
                className="w-12 h-12 rounded-xl bg-gray-200 hover:bg-gray-300 text-xl font-bold shadow transition"
                title="Reset Form"
              >
                ↺
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

/* Small helper layout */
const Field = ({ label, children }: any) => (
  <div className="grid grid-cols-12 gap-6 items-start">
    <label className="col-span-3 text-right text-xs font-bold uppercase text-gray-500 tracking-wide pt-3">
      {label}
    </label>
    <div className="col-span-9">{children}</div>
  </div>
);

/* Tailwind shortcut */
const input =
  "w-full p-3 rounded-lg bg-gray-100 focus:bg-white border border-transparent focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition";

export default BatchEntry;