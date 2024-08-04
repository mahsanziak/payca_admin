import React from 'react';
import { useRouter } from 'next/router';
import {
  BarChart,
  Bar,
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
import { FaArrowLeft } from 'react-icons/fa';

const averageOrderData = [
  { name: 'Average Order Size', size: 50 },
  { name: 'Average Tip Size', size: 10 },
  { name: 'Average Order Duration', duration: 30 },
];

const checkoutData = [
  { name: 'Checked Out', value: 75 },
  { name: 'Unchecked', value: 25 },
];

const COLORS = ['#FF8042', '#00C49F'];

const CustomerTurnoverReportsPage = () => {
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

      <h2 className="text-3xl font-bold mb-4">Customer Duration and Table Turnover Reports</h2>

      <div className="bg-white p-4 rounded shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Average Order Size and Duration</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={averageOrderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="size" fill="#8884d8" />
            <Bar dataKey="duration" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Checkout vs Unchecked Carts</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={checkoutData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {checkoutData.map((entry, index) => (
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

export default CustomerTurnoverReportsPage;
