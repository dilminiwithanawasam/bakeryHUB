import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Eye, FileText, Filter, Calendar } from 'lucide-react';

// Hardcoded batch data
const hardcodedBatches = [
  {
    id: 'BATCH-001',
    product_name: 'Chocolate Brownie',
    quantity: 50,
    unit: 'PCS',
    production_date: '2024-01-20',
    expiry_date: '2024-01-27',
    production_cost: 12500
  },
  {
    id: 'BATCH-002',
    product_name: 'Vanilla Cake',
    quantity: 20,
    unit: 'PCS',
    production_date: '2024-01-19',
    expiry_date: '2024-01-24',
    production_cost: 18000
  },
  {
    id: 'BATCH-003',
    product_name: 'Croissant',
    quantity: 100,
    unit: 'PCS',
    production_date: '2024-01-18',
    expiry_date: '2024-01-21',
    production_cost: 18000
  },
  {
    id: 'BATCH-004',
    product_name: 'Whole Wheat Bread',
    quantity: 30,
    unit: 'BOX',
    production_date: '2024-01-17',
    expiry_date: '2024-01-21',
    production_cost: 9000
  },
  {
    id: 'BATCH-005',
    product_name: 'Blueberry Muffin',
    quantity: 75,
    unit: 'PCS',
    production_date: '2024-01-20',
    expiry_date: '2024-01-24',
    production_cost: 15750
  },
  {
    id: 'BATCH-006',
    product_name: 'Chocolate Chip Cookies',
    quantity: 150,
    unit: 'PCS',
    production_date: '2024-01-16',
    expiry_date: '2024-01-30',
    production_cost: 6000
  }
];

const BatchList = () => {
  const navigate = useNavigate();
  const batches = hardcodedBatches;

  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredBatches = batches.filter(batch => {
    return (
      (!dateRange.start || batch.production_date >= dateRange.start) &&
      (!dateRange.end || batch.production_date <= dateRange.end)
    );
  });

  const stats = {
    totalBatches: batches.length,
    totalQuantity: batches.reduce((sum, b) => sum + b.quantity, 0),
    totalProductionCost: batches.reduce((sum, b) => sum + b.production_cost, 0)
  };

  const handleViewBatch = (batchId: string) => {
    alert(`Viewing batch ${batchId}`);
  };

  const handleGenerateReport = () => {
    alert('Generating batch production report...');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Production Batches 🏭
            </h1>
            <p className="text-gray-500 mt-1">
              Track and manage all production batches
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleGenerateReport}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2"
            >
              <FileText size={20} />
              Generate Report
            </button>
            <button
              onClick={() => navigate('/factory/BatchEntry')}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg"
            >
              + New Batch
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-sm text-gray-500 font-semibold">Total Batches</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">
              {stats.totalBatches}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-sm text-gray-500 font-semibold">Total Quantity</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">
              {stats.totalQuantity}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-sm text-gray-500 font-semibold">
              Total Production Cost
            </div>
            <div className="text-3xl font-bold text-red-600 mt-2">
              LKR {stats.totalProductionCost.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter size={20} className="text-gray-500" />
            <h3 className="font-semibold text-gray-700">Filter by Production Date</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="p-3 rounded-lg bg-gray-50 border"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="p-3 rounded-lg bg-gray-50 border"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Batch ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Dates
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Cost
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredBatches.map(batch => (
                <tr key={batch.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 font-bold">{batch.id}</td>
                  <td className="px-6 py-4">{batch.product_name}</td>
                  <td className="px-6 py-4 font-semibold">
                    {batch.quantity} {batch.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} /> Prod: {batch.production_date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} /> Exp: {batch.expiry_date}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-red-600">
                    LKR {batch.production_cost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewBatch(batch.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg"
                    >
                      <Eye size={18} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default BatchList;
