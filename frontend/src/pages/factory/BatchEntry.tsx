import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

const BatchEntry = () => {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    product_name: '',
    batch_code: '',
    quantity: '',
    mfd: '',
    exp: ''
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send data to the backend endpoint we created
      await api.post('/factory/create-batch', formData);
      
      alert("✅ Batch Added to System Stock Successfully!");
      
      // Optional: Clear form after success
      setFormData({
        product_name: '',
        batch_code: '',
        quantity: '',
        mfd: '',
        exp: ''
      });
      
    } catch (error: any) {
      console.error("Submission Error:", error);
      // Display the specific error message from the backend (e.g., "Product not found")
      const errorMessage = error.response?.data?.error || "Failed to add batch. Please check your inputs.";
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* 1. Sidebar Component (Always present) */}
      <Sidebar />
      
      {/* 2. Main Content Area */}
      <main className="flex-1 ml-64 p-12 bg-white">
        
        {/* --- Top Toggle Tabs (Batch / Product) --- */}
        <div className="flex w-full max-w-2xl mb-10 shadow-sm rounded-md overflow-hidden">
            <div className="flex-1 bg-gray-300 text-gray-700 font-medium py-3 text-center cursor-default">
                Batch
            </div>
            <div className="flex-1 bg-gray-600 text-gray-200 font-medium py-3 text-center cursor-pointer hover:bg-gray-500 transition">
                Product
            </div>
        </div>

        {/* --- View History Button --- */}
        <div className="flex justify-end mb-6 max-w-4xl">
            <button 
              className="bg-[#D98850] hover:bg-[#c27640] text-white font-bold py-2 px-6 rounded shadow-md uppercase text-xs tracking-wide transition"
              onClick={() => alert("Batch History Feature coming soon!")}
            >
                View Batch History
            </button>
        </div>

        {/* --- Main Entry Card --- */}
        <div className="border border-gray-300 rounded-2xl shadow-xl bg-white relative max-w-4xl">
            
            {/* Header with Title */}
            <div className="border-b border-gray-200 p-8 flex justify-between items-center relative">
                <h2 className="text-3xl font-normal text-black tracking-wide">Batch Entry</h2>
                
                {/* Floating Icon Badge (Visual flair from design) */}
                <div className="absolute -top-6 right-10 bg-white p-2 rounded-full shadow-md border border-gray-100">
                    <div className="w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center text-white text-xl">
                       📦
                    </div>
                </div>
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
                            placeholder="e.g. Butter Cake"
                            required
                        />
                    </div>
                </div>

                {/* 2. Batch No */}
                <div className="grid grid-cols-12 items-center gap-6">
                    <label className="col-span-3 text-right font-bold text-gray-600 uppercase text-xs tracking-wider">
                        Batch No
                    </label>
                    <div className="col-span-9">
                        <input 
                            name="batch_code"
                            value={formData.batch_code}
                            onChange={handleChange}
                            className="w-full bg-gray-200 border-none rounded-md p-3 focus:ring-2 focus:ring-[#D98850] outline-none transition"
                            placeholder="e.g. B-001"
                            required
                        />
                    </div>
                </div>

                {/* 3. Quantity */}
                <div className="grid grid-cols-12 items-center gap-6">
                    <label className="col-span-3 text-right font-bold text-gray-600 uppercase text-xs tracking-wider">
                        Quantity Produced
                    </label>
                    <div className="col-span-9">
                        <input 
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full bg-gray-200 border-none rounded-md p-3 focus:ring-2 focus:ring-[#D98850] outline-none transition"
                            placeholder="e.g. 50"
                            required
                        />
                    </div>
                </div>

                {/* 4. Manufactured Date */}
                <div className="grid grid-cols-12 items-center gap-6">
                    <label className="col-span-3 text-right font-bold text-gray-600 uppercase text-xs tracking-wider">
                        Manufactured Date
                    </label>
                    <div className="col-span-9">
                        <input 
                            type="date"
                            name="mfd"
                            value={formData.mfd}
                            onChange={handleChange}
                            className="w-full bg-gray-200 border-none rounded-md p-3 focus:ring-2 focus:ring-[#D98850] outline-none text-gray-600 transition"
                            required
                        />
                    </div>
                </div>

                {/* 5. Expiry Date */}
                <div className="grid grid-cols-12 items-center gap-6">
                    <label className="col-span-3 text-right font-bold text-gray-600 uppercase text-xs tracking-wider">
                        Expiry Date
                    </label>
                    <div className="col-span-9">
                        <input 
                            type="date"
                            name="exp"
                            value={formData.exp}
                            onChange={handleChange}
                            className="w-full bg-gray-200 border-none rounded-md p-3 focus:ring-2 focus:ring-[#D98850] outline-none text-gray-600 transition"
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
                        {loading ? 'Saving...' : 'Add to System Stock'}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => setFormData({ product_name: '', batch_code: '', quantity: '', mfd: '', exp: '' })}
                        className="bg-[#D98850] hover:bg-[#c27640] text-white font-bold h-12 w-12 rounded flex items-center justify-center shadow-md text-2xl transition transform active:scale-95"
                        title="Reset Form"
                    >
                        +
                    </button>
                </div>

            </form>
        </div>

      </main>
    </div>
  );
};

export default BatchEntry;