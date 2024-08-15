import React, { useState, useEffect } from 'react';
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
import { FaArrowLeft, FaChartLine, FaChartPie } from 'react-icons/fa';
import { supabase } from '../../../utils/supabaseClient';

const COLORS = ['#FF8042', '#00C49F'];

const CustomerTurnoverReportsPage = () => {
  const router = useRouter();
  const [averageOrderDuration, setAverageOrderDuration] = useState<number | null>(null);
  const [occupancyData, setOccupancyData] = useState([]);
  const [occupancyByTimeData, setOccupancyByTimeData] = useState([]);
  const [showOccupancyByTime, setShowOccupancyByTime] = useState(false);

  useEffect(() => {
    const calculateAverageOrderDuration = async () => {
      const { data: tables, error } = await supabase
        .from('tables')
        .select('occupied_since, order_end_time')
        .not('occupied_since', 'is', null)
        .not('order_end_time', 'is', null);

      if (error) {
        console.error('Error fetching table data:', error);
        return;
      }

      if (tables && tables.length > 0) {
        let totalDuration = 0;
        let count = 0;

        tables.forEach(table => {
          const startTime = new Date(table.occupied_since);
          const endTime = new Date(table.order_end_time);
          const duration = (endTime.getTime() - startTime.getTime()) / 60000; // Duration in minutes
          
          totalDuration += duration;
          count += 1;
        });

        setAverageOrderDuration(totalDuration / count);
      } else {
        setAverageOrderDuration(0); // Set to 0 if no data
      }
    };

    calculateAverageOrderDuration();
  }, []);

  useEffect(() => {
    const fetchOccupancyData = async () => {
      const { data: tables, error } = await supabase
        .from('tables')
        .select('seats, occupied');

      if (error) {
        console.error('Error fetching occupancy data:', error);
        return;
      }

      if (tables && tables.length > 0) {
        const totalSeats = tables.reduce((acc, table) => acc + table.seats, 0);
        const occupiedSeats = tables
          .filter(table => table.occupied)
          .reduce((acc, table) => acc + table.seats, 0);

        setOccupancyData([
          { name: 'Occupied', value: occupiedSeats },
          { name: 'Available', value: totalSeats - occupiedSeats },
        ]);
      }
    };

    fetchOccupancyData();
  }, []);

  useEffect(() => {
    const fetchOccupancyByTimeData = async () => {
      const { data: orders, error } = await supabase
        .from('tables')
        .select('occupied_since, order_end_time');

      if (error) {
        console.error('Error fetching occupancy by time data:', error);
        return;
      }

      // Process the data to create the time of day occupancy graph data
      if (orders && orders.length > 0) {
        const timeData = {};

        orders.forEach(order => {
          const startTime = new Date(order.occupied_since);
          const endTime = new Date(order.order_end_time);
          const startHour = startTime.getHours();
          const endHour = endTime.getHours();

          for (let hour = startHour; hour <= endHour; hour++) {
            const formattedHour = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;

            if (!timeData[formattedHour]) {
              timeData[formattedHour] = 0;
            }
            timeData[formattedHour]++;
          }
        });

        setOccupancyByTimeData(
          Object.keys(timeData).map(hour => ({
            time: hour,
            seatsOccupied: timeData[hour],
          }))
        );
      }
    };

    fetchOccupancyByTimeData();
  }, []);

  const averageOrderData = [
    { name: 'Average Order Size', size: 50 }, // Example hardcoded data
    { name: 'Average Tip Size', size: 10 },   // Example hardcoded data
    { name: 'Average Order Duration', duration: averageOrderDuration || 0 }, // Calculated value
  ];

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

      {/* Average Order Size and Duration */}
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

      {/* Restaurant Occupancy */}
      <div className="bg-white p-4 rounded shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Restaurant Occupancy</h3>
        <ResponsiveContainer width="100%" height={400}>
          {showOccupancyByTime ? (
            <BarChart data={occupancyByTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="seatsOccupied" fill="#FF8042" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={occupancyData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {occupancyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>

        <button
          className="mt-4 flex items-center bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowOccupancyByTime(!showOccupancyByTime)}
        >
          {showOccupancyByTime ? (
            <>
              <FaChartPie className="mr-2" />
              View Occupancy Overview
            </>
          ) : (
            <>
              <FaChartLine className="mr-2" />
              View Occupancy by Time
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CustomerTurnoverReportsPage;
