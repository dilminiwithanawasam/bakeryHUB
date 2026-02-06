import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FactoryManagerLayout from '../../components/FactoryManagerLayout';

interface Batch {
  id: string;
  name: string;
  product: string;
  quantity: number;
  startTime: string;
  endTime?: string;
  status: 'In Progress' | 'Completed' | 'Scheduled';
  batchNumber: number;
}

const Batches: React.FC = () => {
  const navigate = useNavigate();
  const [batches] = React.useState<Batch[]>([
    {
      id: 'BATCH-001',
      name: 'Croissants - Morning',
      product: 'Croissants',
      quantity: 150,
      startTime: '2026-02-06 06:00 AM',
      endTime: '2026-02-06 09:30 AM',
      status: 'Completed',
      batchNumber: 1,
    },
    {
      id: 'BATCH-002',
      name: 'Donut Mix - Midday',
      product: 'Donuts (Assorted)',
      quantity: 250,
      startTime: '2026-02-06 10:00 AM',
      status: 'In Progress',
      batchNumber: 2,
    },
    {
      id: 'BATCH-003',
      name: 'Cakes & Pastries',
      product: 'Specialty Cakes',
      quantity: 45,
      startTime: '2026-02-06 02:00 PM',
      status: 'Scheduled',
      batchNumber: 3,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <FactoryManagerLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Production Batches</h1>
            <p className="text-gray-600 mt-1">Manage daily production batches and schedules</p>
          </div>
          <button 
            onClick={() => navigate('/factory/BatchEntry')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition">
            <Plus size={20} />
            New Batch
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Batch ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Quantity</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Time</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-800">{batch.id}</td>
                    <td className="px-6 py-4 text-gray-800">{batch.product}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        {batch.quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {batch.startTime}
                      {batch.endTime && <div className="text-xs text-green-600">→ {batch.endTime}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(batch.status)}`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2 flex">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FactoryManagerLayout>
  );
};

export default Batches;
