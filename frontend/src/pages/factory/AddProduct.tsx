import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    category: '',
    base_price: '',
    shelf_life_days: '',
    measurement_type: 'PCS'
  });

  // Pre-defined categories to choose from (improves UX and keeps product taxonomy consistent)
  const categoriesList = ['Bread', 'Cake', 'Beverages', 'Pastry', 'Savory'];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await api.post('/products/', formData);
      setSuccessMessage('✅ Product Created Successfully!');
      
      // Reset form
      setFormData({
        product_name: '',
        description: '',
        category: '',
        base_price: '',
        shelf_life_days: '',
        measurement_type: 'PCS'
      });
      
      // Redirect to product list after 1.5 seconds
          setTimeout(() => {
            navigate('/factory-manager/products');
      }, 1500);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Failed to create product.';
      const errorDetails = error.response?.data?.details || '';
      setErrorMessage(`❌ ${errorMessage}${errorDetails ? '\n' + errorDetails : ''}`);
      console.error('Product creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Sidebar />

      <main className="flex-1 ml-64 p-12 overflow-y-auto">

        {/* Toggle Tabs */}
        <div className="flex max-w-3xl mb-10 rounded-xl overflow-hidden shadow-md">
          <div
            onClick={() => navigate('/factory/BatchEntry')}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 font-semibold text-center cursor-pointer transition"
          >
            Batch
          </div>
          <div className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 font-semibold text-center">
            Product
          </div>
        </div>

        {/* Page Header with View Products Button */}
        <div className="max-w-5xl mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Add New Product 📦
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Define product details before adding stock to the factory
            </p>
          </div>
          <button
            onClick={() => navigate('/factory-manager/products')}
            className="text-orange-600 hover:text-orange-800 font-semibold transition underline-offset-4 hover:to-orange-950"

          >
            📋 View Products
          </button>
        </div>

        {/* Main Card */}
        <div className="max-w-5xl bg-white rounded-3xl shadow-2xl border border-orange-200">

          <div className="border-b p-8">
            <p className="text-gray-600 text-sm">
              All products created here will be available for batch production.
            </p>
          </div>

          {successMessage && (
            <div className="mx-10 mt-6 p-4 bg-green-50 border-l-4 border-green-600 text-green-800 rounded-lg">
              <p className="font-semibold">{successMessage}</p>
              <p className="text-sm text-green-700">Redirecting to product list...</p>
            </div>
          )}

          {errorMessage && (
            <div className="mx-10 mt-6 p-4 bg-red-50 border-l-4 border-red-600 text-red-800 rounded-lg whitespace-pre-wrap">
              <p className="font-semibold">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-10 space-y-8">

            <Field label="Product Name">
              <input
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                className="input"
                placeholder="Chocolate Brownie"
                required
              />
            </Field>

            <Field label="Description">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="input resize-none"
                placeholder="Short description of the product"
              />
            </Field>

            {/* Category + Unit */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-6">
                <FieldInline label="Category">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input cursor-pointer"
                    required
                  >
                    <option value="">Select category</option>
                    {categoriesList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </FieldInline>
              </div>

              <div className="col-span-6">
                <FieldInline label="Unit">
                  <select
                    name="measurement_type"
                    value={formData.measurement_type}
                    onChange={handleChange}
                    className="input cursor-pointer"
                  >
                    <option value="PCS">PCS</option>
                    <option value="KG">KG</option>
                    <option value="BOX">BOX</option>
                    <option value="LITRE">LITRE</option>
                  </select>
                </FieldInline>
              </div>
            </div>

            <Field label="Base Price (LKR)">
              <input
                type="number"
                step="0.01"
                name="base_price"
                value={formData.base_price}
                onChange={handleChange}
                className="input"
                placeholder="0.00"
                required
              />
            </Field>

            <Field label="Shelf Life (Days)">
              <input
                type="number"
                name="shelf_life_days"
                value={formData.shelf_life_days}
                onChange={handleChange}
                className="input bg-orange-50"
                placeholder="e.g. 5"
                required
              />
              <p className="text-xs text-orange-600 mt-2">
                ⓘ Used to auto-calculate expiry date during batch creation
              </p>
            </Field>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg transition disabled:opacity-60"
              >
                {loading ? 'Creating…' : 'Create Product'}
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    product_name: '',
                    description: '',
                    category: '',
                    base_price: '',
                    shelf_life_days: '',
                    measurement_type: 'PCS'
                  })
                }
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

/* Helpers */
const Field = ({ label, children }: any) => (
  <div className="grid grid-cols-12 gap-6 items-start">
    <label className="col-span-3 text-right text-xs font-bold uppercase text-gray-500 tracking-wide pt-3">
      {label}
    </label>
    <div className="col-span-9">{children}</div>
  </div>
);

const FieldInline = ({ label, children }: any) => (
  <div className="grid grid-cols-12 gap-2 items-center">
    <label className="col-span-4 text-right text-xs font-bold uppercase text-gray-500 tracking-wide">
      {label}
    </label>
    <div className="col-span-8">{children}</div>
  </div>
);

export default AddProduct;