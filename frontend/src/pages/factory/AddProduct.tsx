import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State matches your Prisma 'products' model
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    category: '',
    base_price: '',
    shelf_life_days: '',
    measurement_type: 'PCS' // Default value matching your Enum
  });

  // Handle text and select changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ---------------------------------------------------------
      // UPDATED: Point to the new Product Controller Route
      // Old: /factory/add-product
      // New: /products/add (Matches routes/productRoutes.ts)
      // ---------------------------------------------------------
      await api.post('/products/add', formData);
      
      alert("✅ Product Created Successfully!");
      
      // Redirect back to Batch Entry so you can immediately add stock for this new product
      navigate('/factory/BatchEntry'); 
      
    } catch (error: any) {
      console.error("Submission Error:", error);
      // The backend now returns detailed errors (e.g., "Price must be greater than 0")
      const errorMessage = error.response?.data?.error || "Failed to create product.";
      const errorDetails = error.response?.data?.details || ""; // Extra details if available
      
      alert(`❌ Error: ${errorMessage} \n${errorDetails}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* 1. Sidebar Component */}
      <Sidebar />
      
      {/* 2. Main Content Area */}
      <main className="flex-1 ml-64 p-12 bg-white">
        
        {/* --- Top Toggle Tabs (Batch / Product) --- */}
        {/* This mimics the look from BatchEntry but highlights 'Product' */}
        <div className="flex w-full max-w-2xl mb-10 shadow-sm rounded-md overflow-hidden">
            <div 
              onClick={() => navigate('/factory/BatchEntry')}
              className="flex-1 bg-gray-300 text-gray-700 font-medium py-3 text-center cursor-pointer hover:bg-gray-400 transition">
                Batch
            </div>
            <div className="flex-1 bg-gray-600 text-gray-200 font-medium py-3 text-center cursor-default">
                Product
            </div>
        </div>

        {/* --- Main Entry Card --- */}
        <div className="border border-gray-300 rounded-2xl shadow-xl bg-white relative max-w-4xl">
            
            {/* Header */}
            <div className="border-b border-gray-200 p-8">
                <h2 className="text-3xl font-normal text-black tracking-wide">Add New Product</h2>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                
                {/* 1. Product Name */}
                <div className="grid grid-cols-12 items-center gap-6">
                    <label className="col-span-3 text-right font-bold text-gray-600 uppercase text-xs tracking-wider">
                        Product Name
                    </label>
                    <div className="col-span-9">
                        <input 
                            name="product_name"
                            value={formData.product_name} 
                            onChange={handleChange}
                            className="w-full bg-gray-200 border-none rounded-md p-3 focus:ring-2 focus:ring-[#D98850] outline-none transition" 
                            placeholder="e.g. Chocolate Brownie"
                            required
                        />
                    </div>
                </div>

                {/* 2. Description */}
                <div className="grid grid-cols-12 items-center gap-6">
                    <label className="col-span-3 text-right font-bold text-gray-600 uppercase text-xs tracking-wider">
                        Description
                    </label>
                    <div className="col-span-9">
                        <textarea 
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={2}
                            className="w-full bg-gray-200 border-none rounded-md p-3 focus:ring-2 focus:ring-[#D98850] outline-none transition"
                            placeholder="Short description of the item..."
                        />
                    </div>
                </div>

                {/* 3. Category & Unit (Side by Side) */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Category */}
                    <div className="col-span-6 grid grid-cols-12 items-center gap-2">
                         <label className="col-span-4 text-right font-bold text-gray-600 uppercase text-xs tracking-wider">
                            Category
                         </label>
                         <div className="col-span-8">
                            <input 
                                name="category" 
                                value={formData.category} 
                                onChange={handleChange}
                                className="w-full bg-gray-200 border-none rounded-md p-3 focus:ring-2 focus:ring-[#D98850] outline-none" 
                                placeholder="e.g. Cakes"
                                required
                            />
                         </div>
                    </div>

                    {/* Measurement Type (Enum) */}
                    <div className="col-span-6 grid grid-cols-12 items-center gap-2">
                         <label className="col-span-4 text-right font-bold text-gray-600 uppercase text-xs tracking-wider">
                            Unit
                         </label>
                         <div className="col-span-8">
                            <select 
                                name="measurement_type" 
                                value={formData.measurement_type} 
                                onChange={handleChange}
                                className="w-full bg-gray-200 border-none rounded-md p-3 focus:ring-2 focus:ring-[#D98850] outline-none cursor-pointer"
                            >
                                <option value="PCS">PCS</option>
                                <option value="KG">KG</option>
                                <option value="BOX">BOX</option>
                                <option value="LITRE">LITRE</option>
                            </select>
                         </div>
                    </div>
                </div>

                {/* 4. Base Price */}
                <div className="grid grid-cols-12 items-center gap-6">
                    <label className="col-span-3 text-right font-bold text-gray-600 uppercase text-xs tracking-wider">
                        Base Price (LKR)
                    </label>
                    <div className="col-span-9">
                        <input 
                            type="number" 
                            step="0.01" 
                            name="base_price" 
                            value={formData.base_price} 
                            onChange={handleChange}
                            className="w-full bg-gray-200 border-none rounded-md p-3 focus:ring-2 focus:ring-[#D98850] outline-none" 
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

                {/* 5. Shelf Life */}
                <div className="grid grid-cols-12 items-center gap-6">
                    <label className="col-span-3 text-right font-bold text-gray-600 uppercase text-xs tracking-wider">
                        Shelf Life (Days)
                    </label>
                    <div className="col-span-9">
                        <input 
                            type="number" 
                            name="shelf_life_days" 
                            value={formData.shelf_life_days} 
                            onChange={handleChange}
                            className="w-full bg-gray-200 border-none rounded-md p-3 focus:ring-2 focus:ring-[#D98850] outline-none" 
                            placeholder="e.g. 5"
                            required
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end items-center gap-4 mt-12 pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`bg-[#D98850] hover:bg-[#c27640] text-white font-bold py-3 px-8 rounded shadow-md uppercase text-sm tracking-wide transition transform active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Creating...' : 'Create Product'}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => setFormData({ product_name: '', description: '', category: '', base_price: '', shelf_life_days: '', measurement_type: 'PCS' })}
                        className="bg-[#D98850] hover:bg-[#c27640] text-white font-bold h-12 w-12 rounded flex items-center justify-center shadow-md text-2xl transition transform active:scale-95"
                        title="Reset Form"
                    >
                        ↻
                    </button>
                </div>

            </form>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;