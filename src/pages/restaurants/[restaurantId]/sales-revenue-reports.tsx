import React from 'react';
import { useRouter } from 'next/router';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { FaArrowLeft } from 'react-icons/fa'; // Import FontAwesome arrow icon

const data = [
  { name: 'Jan', Sales: 4000, Revenue: 2400 },
  { name: 'Feb', Sales: 3000, Revenue: 1398 },
  { name: 'Mar', Sales: 2000, Revenue: 9800 },
  { name: 'Apr', Sales: 2780, Revenue: 3908 },
  { name: 'May', Sales: 1890, Revenue: 4800 },
  { name: 'Jun', Sales: 2390, Revenue: 3800 },
  { name: 'Jul', Sales: 3490, Revenue: 4300 },
];

const pieData = [
  { name: 'Tips', value: 1200 },
  { name: 'Cost', value: 3000 },
  { name: 'Profit', value: 5800 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const SalesRevenueReportsPage = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto p-4">
      {/* Back Arrow */}
      <div className="mb-4">
        <button onClick={() => router.back()} className="flex items-center text-gray-700 hover:text-gray-900">
          <FaArrowLeft className="mr-2" />
          Back to Reports
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-4">Sales and Revenue Reports</h2>

      <div className="bg-white p-4 rounded shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Sales and Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Sales" stroke="#8884d8" />
            <Line type="monotone" dataKey="Revenue" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Distribution of Tips, Cost, and Profit</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesRevenueReportsPage;
