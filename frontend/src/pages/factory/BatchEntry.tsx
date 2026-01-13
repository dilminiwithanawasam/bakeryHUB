import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';

// 1. Updated Interface to include shelf_life_days
interface Product {
  product_id: number;
  product_name: string;
  shelf_life_days: number; // Required for calculation
}

const BatchEntry = () => {
  const navigate = useNavigate();
  
  // Helper: Get Today's Date in YYYY-MM-DD format
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // Helper: Add days to a date string
  const calculateExpiry = (startDate: string, days: number): string => {
    if (!startDate || !days) return '';
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const [productList, setProductList] = useState<Product[]>([]);
  
  // 2. Initialize State with MFD set to Today
  const [formData, setFormData] = useState({
    product_id: '', 
    batch_code: '',
    quantity: '',
    mfd: getTodayDate(),
    exp: ''
  });

  const [loading, setLoading] = useState(false);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products'); 
        setProductList(res.data);
      } catch (err) {
        console.error("Failed to load products for dropdown");
      }
    };
    fetchProducts();
  }, []);

  // ---------------------------------------------------------
  // SPECIAL HANDLERS FOR AUTO-CALCULATION
  // ---------------------------------------------------------

  // A. When Product Changes -> Find Shelf Life -> Update Expiry
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProductId = e.target.value;
    const selectedProduct = productList.find(p => p.product_id === parseInt(newProductId));

    setFormData(prev => {
        // Calculate new expiry based on current MFD + Product Shelf Life
        const newExp = selectedProduct 
            ? calculateExpiry(prev.mfd, selectedProduct.shelf_life_days)
            : prev.exp;

        return {
            ...prev,
            product_id: newProductId,
            exp: newExp
        };
    });
  };

  // B. When MFD Changes -> Find Current Product Shelf Life -> Update Expiry
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMfd = e.target.value;
    const currentProduct = productList.find(p => p.product_id === parseInt(formData.product_id));

    setFormData(prev => {
        // Calculate new expiry based on New MFD + Current Product Shelf Life
        const newExp = currentProduct 
            ? calculateExpiry(newMfd, currentProduct.shelf_life_days)
            : prev.exp;

        return {
            ...prev,
            mfd: newMfd,
            exp: newExp
        };
    });
  };

  // C. Standard Handler for other inputs (Batch Code, Quantity, Manual Exp override)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------------------------------------------------
  // SUBMISSION
  // ---------------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        product_id: parseInt(formData.product_id),
        batch_code: formData.batch_code,
        quantity: parseInt(formData.quantity),
        mfd: formData.mfd,
        exp: formData.exp
      };

      await api.post('/factory/create-batch', payload);
      
      alert("✅ Batch Added to System Stock Successfully!");
      
      // Clear form (Reset MFD to today)
      setFormData({
        product_id: '',
        batch_code: '',
        quantity: '',
        mfd: getTodayDate(),
        exp: ''
      });
      
    } catch (error: any) {
      console.error("Submission Error:", error);
      const errorMessage = error.response?.data?.error || "Failed to add batch.";
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12 bg-white">
        
        {/* Toggle Tabs */}
        <div className="flex w-full max-w-2xl mb-10 shadow-sm rounded-md overflow-hidden">
            <div className="flex-1 bg-gray-600 text-gray-200 font-medium py-3 text-center cursor-default">
                Batch
            </div>
            <div 
                onClick={() => navigate('/factory/AddProduct')}
                className="flex-1 bg-gray-300 text-gray-700 font-medium py-3 text-center cursor-pointer hover:bg-gray-400 transition"
            >
                Product
            </div>
        </div>

        {/* View History Button */}
        <div className="flex justify-end mb-6 max-w-4xl">
            <button 
              className="bg-[#D98850] hover:bg-[#c27640] text-white font-bold py-2 px-6 rounded shadow-md uppercase text-xs tracking-wide transition"
              onClick={() => alert("Batch History Feature coming soon!")}
            >
                View Batch History
            </button>
        </div>

        {/* Main Entry Card */}
        <div className="border border-gray-300 rounded-2xl shadow-xl bg-white relative max-w-4xl">
            
            <div className="border-b border-gray-200 p-8 flex justify-between items-center relative">
                <h2 className="text-3xl font-normal text-black tracking-wide">Batch Entry</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                
                {/* 1. Product Selection (Uses handleProductChange) */}
                <div className="grid grid-cols-12 items-center gap-6">
                    <label className="col-span-3 text-right font-bold text-gray-600 uppercase text-xs tracking-wider">
                        Select Product
                    </label>
                    <div className="col-span-9">
                        <select 
                            name="product_id"
                            value={formData.product_id} 
                            onChange={handleProductChange} // <--- Linked here
                            className="w-full bg-gray-200 border-none rounded-md p-3 focus:ring-2 focus:ring-[#D98850] outline-none transition cursor-pointer" 
                            required
                        >
                            <option value="">-- Choose a Product --</option>
                            {productList.map((prod) => (
                                <option key={prod.product_id} value={prod.product_id}>
                                    {prod.product_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Batch No */}
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

                {/* Quantity */}
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

                {/* 2. Manufactured Date (Uses handleDateChange) */}
                <div className="grid grid-cols-12 items-center gap-6">
                    <label className="col-span-3 text-right font-bold text-gray-600 uppercase text-xs tracking-wider">
                        Manufactured Date
                    </label>
                    <div className="col-span-9">
                        <input 
                            type="date"
                            name="mfd"
                            value={formData.mfd}
                            onChange={handleDateChange} // <--- Linked here
                            className="w-full bg-gray-200 border-none rounded-md p-3 focus:ring-2 focus:ring-[#D98850] outline-none text-gray-600 transition"
                            required
                        />
                    </div>
                </div>

                {/* 3. Expiry Date (Auto-Calculated) */}
                <div className="grid grid-cols-12 items-center gap-6">
                    <label className="col-span-3 text-right font-bold text-gray-600 uppercase text-xs tracking-wider">
                        Expiry Date
                    </label>
                    <div className="col-span-9">
                        <input 
                            type="date"
                            name="exp"
                            value={formData.exp}
                            onChange={handleChange} // Allows manual override if necessary
                            className="w-full bg-gray-200 border-none rounded-md p-3 focus:ring-2 focus:ring-[#D98850] outline-none text-gray-600 transition"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-2 text-right">
                           * Auto-calculated based on product shelf life
                        </p>
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
                        onClick={() => setFormData({ product_id: '', batch_code: '', quantity: '', mfd: getTodayDate(), exp: '' })}
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